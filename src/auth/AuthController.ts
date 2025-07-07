/**
 * Advanced Authentication Controller
 * Handles registration, login, password reset, 2FA, and social auth
 */

import { Request, Response } from 'express';
import { User, IUser } from '../users/models/User';
import { validationResult } from 'express-validator';
import { sendEmail } from '../services/EmailService';
import { generateTOTP, verifyTOTP } from '../services/TwoFactorService';
import { trackSecurityEvent } from '../services/SecurityService';

export class AuthController {
  
  /**
   * User Registration
   */
  async register(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email, password, name, referralCode } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          error: 'Email already registered',
          code: 'EMAIL_EXISTS'
        });
      }

      // Create user
      const user = new User({
        email,
        password,
        name,
        status: 'pending_verification'
      });

      // Apply referral bonus if valid
      if (referralCode) {
        const bonus = await this.applyReferralBonus(user, referralCode);
        if (bonus) {
          user.subscription.trialEndsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        }
      }

      await user.save();

      // Send verification email
      await this.sendVerificationEmail(user);

      // Track registration
      await trackSecurityEvent('user_registered', {
        userId: user._id,
        email: user.email,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      res.status(201).json({
        message: 'Registration successful',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          status: user.status,
          tier: user.tier
        },
        nextStep: 'verify_email'
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Registration failed',
        code: 'REGISTRATION_ERROR'
      });
    }
  }

  /**
   * User Login
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password, totpCode } = req.body;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'] as string;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        await this.trackFailedLogin(email, ip, userAgent, 'user_not_found');
        return res.status(401).json({
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Check if account is locked
      if (user.isLocked) {
        return res.status(423).json({
          error: 'Account temporarily locked due to too many failed attempts',
          code: 'ACCOUNT_LOCKED',
          lockedUntil: user.security.lockedUntil
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        await this.handleFailedLogin(user, ip, userAgent);
        return res.status(401).json({
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Check 2FA if enabled
      if (user.twoFactorEnabled) {
        if (!totpCode) {
          return res.status(200).json({
            message: 'Two-factor authentication required',
            requiresTwoFactor: true,
            userId: user._id
          });
        }

        const isTOTPValid = verifyTOTP(user.twoFactorSecret, totpCode);
        if (!isTOTPValid) {
          await this.handleFailedLogin(user, ip, userAgent);
          return res.status(401).json({
            error: 'Invalid 2FA code',
            code: 'INVALID_2FA'
          });
        }
      }

      // Successful login
      await this.handleSuccessfulLogin(user, ip, userAgent);

      const token = user.generateJWT();

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          tier: user.tier,
          preferences: user.preferences,
          usage: user.usage
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Login failed',
        code: 'LOGIN_ERROR'
      });
    }
  }

  /**
   * Password Reset Request
   */
  async requestPasswordReset(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if email exists
        return res.json({
          message: 'If an account with that email exists, a password reset link has been sent'
        });
      }

      // Generate reset token
      const resetToken = this.generateResetToken();
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset token (in production, use Redis or database)
      await this.storeResetToken(user._id, resetToken, resetExpires);

      // Send reset email
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        template: 'password-reset',
        data: {
          name: user.name || 'User',
          resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
          expiresIn: '1 hour'
        }
      });

      // Track password reset request
      await trackSecurityEvent('password_reset_requested', {
        userId: user._id,
        email: user.email,
        ip: req.ip
      });

      res.json({
        message: 'If an account with that email exists, a password reset link has been sent'
      });

    } catch (error) {
      console.error('Password reset request error:', error);
      res.status(500).json({
        error: 'Failed to process password reset request'
      });
    }
  }

  /**
   * Reset Password
   */
  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;

      // Validate token
      const tokenData = await this.validateResetToken(token);
      if (!tokenData) {
        return res.status(400).json({
          error: 'Invalid or expired reset token',
          code: 'INVALID_TOKEN'
        });
      }

      const user = await User.findById(tokenData.userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      // Update password
      user.password = newPassword;
      user.security.failedLoginAttempts = 0;
      user.security.lockedUntil = undefined;
      await user.save();

      // Invalidate reset token
      await this.invalidateResetToken(token);

      // Track password reset
      await trackSecurityEvent('password_reset_completed', {
        userId: user._id,
        email: user.email,
        ip: req.ip
      });

      res.json({
        message: 'Password reset successful'
      });

    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({
        error: 'Failed to reset password'
      });
    }
  }

  /**
   * Enable Two-Factor Authentication
   */
  async enableTwoFactor(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.twoFactorEnabled) {
        return res.status(400).json({ error: '2FA already enabled' });
      }

      // Generate TOTP secret
      const secret = generateTOTP();
      const qrCode = await this.generateQRCode(user.email, secret);

      // Store secret temporarily (user needs to verify before enabling)
      await this.storeTempTwoFactorSecret(userId, secret);

      res.json({
        secret,
        qrCode,
        backupCodes: this.generateBackupCodes(),
        message: 'Scan the QR code with your authenticator app and verify to enable 2FA'
      });

    } catch (error) {
      console.error('Enable 2FA error:', error);
      res.status(500).json({ error: 'Failed to enable 2FA' });
    }
  }

  // Helper methods
  private async handleSuccessfulLogin(user: IUser, ip: string, userAgent: string) {
    user.security.lastLogin = new Date();
    user.security.failedLoginAttempts = 0;
    user.security.lockedUntil = undefined;
    
    user.security.loginHistory.push({
      timestamp: new Date(),
      ip,
      userAgent,
      success: true
    });

    // Keep only last 10 login records
    if (user.security.loginHistory.length > 10) {
      user.security.loginHistory = user.security.loginHistory.slice(-10);
    }

    await user.save();

    await trackSecurityEvent('login_successful', {
      userId: user._id,
      email: user.email,
      ip,
      userAgent
    });
  }

  private async handleFailedLogin(user: IUser, ip: string, userAgent: string) {
    user.security.failedLoginAttempts += 1;
    
    user.security.loginHistory.push({
      timestamp: new Date(),
      ip,
      userAgent,
      success: false
    });

    // Lock account after 5 failed attempts
    if (user.security.failedLoginAttempts >= 5) {
      user.security.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    }

    await user.save();

    await trackSecurityEvent('login_failed', {
      userId: user._id,
      email: user.email,
      ip,
      userAgent,
      attempts: user.security.failedLoginAttempts
    });
  }

  private async trackFailedLogin(email: string, ip: string, userAgent: string, reason: string) {
    await trackSecurityEvent('login_failed', {
      email,
      ip,
      userAgent,
      reason
    });
  }

  private async sendVerificationEmail(user: IUser) {
    const verificationToken = this.generateVerificationToken();
    await this.storeVerificationToken(user._id, verificationToken);

    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email Address',
      template: 'email-verification',
      data: {
        name: user.name || 'User',
        verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
      }
    });
  }

  private generateResetToken(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }

  private generateVerificationToken(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }

  private generateBackupCodes(): string[] {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(require('crypto').randomBytes(4).toString('hex'));
    }
    return codes;
  }

  private async applyReferralBonus(user: IUser, referralCode: string): Promise<boolean> {
    // Implementation for referral system
    return false;
  }

  private async storeResetToken(userId: string, token: string, expires: Date): Promise<void> {
    // Store in Redis or database
  }

  private async validateResetToken(token: string): Promise<any> {
    // Validate token from Redis or database
    return null;
  }

  private async invalidateResetToken(token: string): Promise<void> {
    // Remove token from Redis or database
  }

  private async storeVerificationToken(userId: string, token: string): Promise<void> {
    // Store verification token
  }

  private async storeTempTwoFactorSecret(userId: string, secret: string): Promise<void> {
    // Store temporary 2FA secret
  }

  private async generateQRCode(email: string, secret: string): Promise<string> {
    // Generate QR code for 2FA setup
    return '';
  }
}
