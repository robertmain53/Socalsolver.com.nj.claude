/**
 * Widget Builder - Visual interface for creating embeddable widgets
 */

import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface WidgetConfig {
  calculatorId: string;
  theme: 'light' | 'dark' | 'custom';
  size: 'compact' | 'medium' | 'large' | 'fullwidth';
  branding: boolean;
  whiteLabel: boolean;
  customCss: string;
  domain: string;
}

export default function WidgetBuilder() {
  const [config, setConfig] = useState<WidgetConfig>({
    calculatorId: '',
    theme: 'light',
    size: 'medium',
    branding: true,
    whiteLabel: false,
    customCss: '',
    domain: ''
  });
  
  const [embedCode, setEmbedCode] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (config.calculatorId && config.domain) {
      generateEmbedCode();
    }
  }, [config]);
  
  const generateEmbedCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/embed/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      const data = await response.json();
      setEmbedCode(data.embedCode);
      setPreviewUrl(data.iframeUrl);
      
    } catch (error) {
      console.error('Failed to generate embed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show success message
  };
  
  return (
    <div className="widget-builder">
      <div className="builder-header">
        <h1>Widget Builder</h1>
        <p>Create embeddable calculator widgets for your website</p>
      </div>
      
      <div className="builder-content">
        <div className="builder-config">
          <h2>Configuration</h2>
          
          <div className="config-group">
            <label>Calculator</label>
            <select 
              value={config.calculatorId}
              onChange={(e) => setConfig({...config, calculatorId: e.target.value})}
            >
              <option value="">Select Calculator</option>
              <option value="mortgage">Mortgage Calculator</option>
              <option value="loan">Loan Calculator</option>
              <option value="savings">Savings Calculator</option>
              {/* Dynamic options would be loaded from API */}
            </select>
          </div>
          
          <div className="config-group">
            <label>Website Domain</label>
            <input 
              type="url"
              value={config.domain}
              onChange={(e) => setConfig({...config, domain: e.target.value})}
              placeholder="https://yourwebsite.com"
            />
          </div>
          
          <div className="config-group">
            <label>Theme</label>
            <div className="theme-options">
              {['light', 'dark', 'custom'].map(theme => (
                <label key={theme} className="radio-option">
                  <input 
                    type="radio"
                    name="theme"
                    value={theme}
                    checked={config.theme === theme}
                    onChange={(e) => setConfig({...config, theme: e.target.value as any})}
                  />
                  <span>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="config-group">
            <label>Size</label>
            <div className="size-options">
              {['compact', 'medium', 'large', 'fullwidth'].map(size => (
                <label key={size} className="radio-option">
                  <input 
                    type="radio"
                    name="size"
                    value={size}
                    checked={config.size === size}
                    onChange={(e) => setConfig({...config, size: e.target.value as any})}
                  />
                  <span>{size.charAt(0).toUpperCase() + size.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="config-group">
            <label className="checkbox-option">
              <input 
                type="checkbox"
                checked={config.branding}
                onChange={(e) => setConfig({...config, branding: e.target.checked})}
              />
              <span>Show Branding</span>
            </label>
          </div>
          
          <div className="config-group">
            <label className="checkbox-option">
              <input 
                type="checkbox"
                checked={config.whiteLabel}
                onChange={(e) => setConfig({...config, whiteLabel: e.target.checked})}
              />
              <span>White Label (Premium)</span>
            </label>
          </div>
          
          <div className="config-group">
            <label>Custom CSS</label>
            <textarea 
              value={config.customCss}
              onChange={(e) => setConfig({...config, customCss: e.target.value})}
              placeholder="/* Custom styles */"
              rows={6}
            />
          </div>
        </div>
        
        <div className="builder-output">
          <h2>Preview</h2>
          {previewUrl && (
            <div className="preview-container">
              <iframe 
                src={previewUrl}
                width="100%"
                height="400"
                frameBorder="0"
                title="Widget Preview"
              />
            </div>
          )}
          
          <h2>Embed Code</h2>
          {embedCode && (
            <div className="embed-code">
              <div className="code-header">
                <span>HTML Embed Code</span>
                <button onClick={() => copyToClipboard(embedCode)}>
                  Copy Code
                </button>
              </div>
              <SyntaxHighlighter 
                language="html" 
                style={tomorrow}
                customStyle={{ margin: 0, borderRadius: '0 0 8px 8px' }}
              >
                {embedCode}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
