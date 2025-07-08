// Complete SocalSolver Design System
export const theme = {
  colors: {
    primary: '#FFD166',    // Sunset Yellow
    secondary: '#FF8C42',  // Orange
    accent: '#FFA69E',     // Coral Pink
    warm: '#F9C74F',       // Golden
    cool: '#4D9FEC',       // Ocean Blue
    mint: '#76C7C0',       // Coastal Mint
    coral: '#FF5E5B',      // Bright Coral
    navy: '#073B4C',       // Deep Navy
  },
  gradients: {
    sunset: 'linear-gradient(135deg, #FFD166 0%, #FF8C42 50%, #FFA69E 100%)',
    ocean: 'linear-gradient(135deg, #4D9FEC 0%, #76C7C0 100%)',
    warm: 'linear-gradient(135deg, #F9C74F 0%, #FFD166 100%)',
    coral: 'linear-gradient(135deg, #FF5E5B 0%, #FFA69E 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
    warning: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    info: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
  },
  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    sunset: '0 10px 30px rgba(255, 140, 66, 0.3)',
    ocean: '0 10px 30px rgba(77, 159, 236, 0.3)',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Georgia', 'serif'],
      mono: ['Monaco', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
    },
    fontWeight: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  animation: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    easing: {
      linear: 'linear',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070,
  },
}

export type Theme = typeof theme

// Theme utilities
export const getColor = (colorPath: string) => {
  const keys = colorPath.split('.')
  let value: any = theme.colors
  
  for (const key of keys) {
    value = value?.[key]
  }
  
  return value || colorPath
}

export const getGradient = (gradientName: keyof typeof theme.gradients) => {
  return theme.gradients[gradientName] || theme.gradients.sunset
}

export const getSpacing = (spacingName: keyof typeof theme.spacing) => {
  return theme.spacing[spacingName] || theme.spacing.md
}

// Responsive utilities
export const responsive = {
  sm: (styles: string) => `@media (min-width: ${theme.breakpoints.sm}) { ${styles} }`,
  md: (styles: string) => `@media (min-width: ${theme.breakpoints.md}) { ${styles} }`,
  lg: (styles: string) => `@media (min-width: ${theme.breakpoints.lg}) { ${styles} }`,
  xl: (styles: string) => `@media (min-width: ${theme.breakpoints.xl}) { ${styles} }`,
  '2xl': (styles: string) => `@media (min-width: ${theme.breakpoints['2xl']}) { ${styles} }`,
}

// Dark mode utilities (for future implementation)
export const darkMode = {
  colors: {
    primary: '#FFD166',
    secondary: '#FF8C42',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
  }
}

export default theme
