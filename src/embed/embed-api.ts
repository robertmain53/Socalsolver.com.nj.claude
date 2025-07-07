/**
 * Embedding API - Handles widget embedding and customization
 */

import { NextApiRequest, NextApiResponse } from 'next';

interface EmbedRequest {
  calculatorId: string;
  domain: string;
  options: {
    theme?: string;
    size?: string;
    branding?: boolean;
    customCss?: string;
    whiteLabel?: boolean;
  };
}

interface EmbedResponse {
  embedCode: string;
  iframeUrl: string;
  jsSnippet: string;
  cssUrl: string;
  analytics: {
    trackingId: string;
    events: string[];
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmbedResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { calculatorId, domain, options }: EmbedRequest = req.body;
    
    // Validate calculator exists
    const calculator = await validateCalculator(calculatorId);
    if (!calculator) {
      return res.status(404).json({ error: 'Calculator not found' });
    }
    
    // Check domain permissions
    const hasPermission = await checkDomainPermissions(domain, calculatorId);
    if (!hasPermission) {
      return res.status(403).json({ error: 'Domain not authorized' });
    }
    
    // Generate embed code
    const embedData = await generateEmbedCode(calculatorId, domain, options);
    
    // Track embed generation
    await trackEmbedGeneration(calculatorId, domain, options);
    
    res.status(200).json(embedData);
    
  } catch (error) {
    console.error('Embed API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function validateCalculator(calculatorId: string): Promise<boolean> {
  // Implementation would check database
  return true;
}

async function checkDomainPermissions(domain: string, calculatorId: string): Promise<boolean> {
  // Check if domain is authorized for this calculator
  // Free tier might have restrictions, paid tiers allow more domains
  return true;
}

async function generateEmbedCode(
  calculatorId: string, 
  domain: string, 
  options: any
): Promise<EmbedResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const trackingId = generateTrackingId();
  
  // Generate iframe URL
  const iframeParams = new URLSearchParams({
    calculator: calculatorId,
    theme: options.theme || 'light',
    size: options.size || 'medium',
    branding: options.branding !== false ? 'true' : 'false',
    tracking: trackingId,
    domain
  });
  
  const iframeUrl = `${baseUrl}/embed/iframe?${iframeParams}`;
  
  // Generate JavaScript snippet
  const jsSnippet = `
<script>
(function() {
  var script = document.createElement('script');
  script.src = '${baseUrl}/embed/widget.js';
  script.async = true;
  script.onload = function() {
    new CalculatorWidget('calculator-${calculatorId}', {
      calculatorId: '${calculatorId}',
      theme: '${options.theme || 'light'}',
      size: '${options.size || 'medium'}',
      branding: ${options.branding !== false},
      analytics: true
    });
  };
  document.head.appendChild(script);
})();
</script>
<div id="calculator-${calculatorId}"></div>
  `.trim();
  
  // Generate embed code (iframe version)
  const embedCode = `
<iframe 
  src="${iframeUrl}"
  width="100%" 
  height="500" 
  frameborder="0"
  style="border: none; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
  title="Calculator Widget">
</iframe>
  `.trim();
  
  return {
    embedCode,
    iframeUrl,
    jsSnippet,
    cssUrl: `${baseUrl}/embed/themes/${options.theme || 'light'}.css`,
    analytics: {
      trackingId,
      events: ['load', 'calculate', 'share', 'convert']
    }
  };
}

function generateTrackingId(): string {
  return `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function trackEmbedGeneration(calculatorId: string, domain: string, options: any): Promise<void> {
  // Track embed generation for analytics
  console.log('Embed generated:', { calculatorId, domain, options });
}
