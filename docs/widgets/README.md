# Calculator Widget & Embedding System

## Overview

The Calculator Widget & Embedding System allows you to integrate powerful calculators into any website with just a few lines of code. Our widgets are optimized for performance, mobile-friendly, and fully customizable.

## Quick Start

### 1. HTML Embed (Easiest)

```html
<iframe 
  src="https://yourcalculatorsite.com/embed/mortgage?theme=light&size=medium"
  width="100%" 
  height="500" 
  frameborder="0">
</iframe>
```

### 2. JavaScript Widget (Recommended)

```html
<!-- Include the widget script -->
<script src="https://yourcalculatorsite.com/embed/widget.js"></script>

<!-- Create container -->
<div id="mortgage-calculator"></div>

<!-- Initialize widget -->
<script>
new CalculatorWidget('mortgage-calculator', {
  calculatorId: 'mortgage',
  theme: 'light',
  size: 'medium',
  branding: true
});
</script>
```

### 3. WordPress Shortcode

```
[calculator id="mortgage" theme="light" size="medium"]
```

### 4. React Component

```jsx
import { CalculatorWidget } from '@your-calculator/react-widgets';

function App() {
  return (
    <CalculatorWidget
      calculatorId="mortgage"
      theme="light"
      size="medium"
      onResult={(result) => console.log(result)}
    />
  );
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `calculatorId` | string | required | Unique identifier for the calculator |
| `theme` | string | 'light' | Widget theme: 'light', 'dark', 'custom' |
| `size` | string | 'medium' | Widget size: 'compact', 'medium', 'large', 'fullwidth' |
| `branding` | boolean | true | Show "Powered by" branding |
| `analytics` | boolean | true | Enable usage analytics |
| `customCss` | string | null | Custom CSS styles |
| `onResult` | function | null | Callback when calculation completes |
| `onError` | function | null | Callback when error occurs |

## Themes

### Light Theme
- Clean, minimal design
- Perfect for most websites
- High contrast for accessibility

### Dark Theme
- Dark background with light text
- Great for dark websites
- Reduces eye strain

### Custom Theme
- Use your own CSS
- Complete control over styling
- White-label options available

## Responsive Design

All widgets are fully responsive and work on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## Performance

- **Fast Loading**: Widgets load in under 200ms
- **Small Footprint**: Core script is only 15KB gzipped
- **CDN Delivery**: Served from global CDN
- **Lazy Loading**: Widgets load only when needed

## Analytics

### Event Tracking

Widgets automatically track:
- Widget loads
- Calculations performed
- Errors encountered
- User interactions
- Conversion events

### Custom Events

```javascript
widget.track('custom_event', {
  category: 'engagement',
  action: 'button_click',
  value: 1
});
```

## API Integration

### REST API

```javascript
// Get calculator definition
const response = await fetch('/api/calculators/mortgage');
const calculator = await response.json();

// Perform calculation
const result = await fetch('/api/calculate', {
  method: 'POST',
  body: JSON.stringify({
    calculatorId: 'mortgage',
    inputs: { principal: 300000, rate: 3.5, term: 30 }
  })
});
```

### GraphQL API

```graphql
query GetCalculator($id: String!) {
  calculator(id: $id) {
    id
    title
    description
    inputs {
      id
      type
      label
      required
    }
  }
}

mutation Calculate($input: CalculationInput!) {
  calculate(input: $input) {
    result
    formatted
    breakdown
  }
}
```

## White Label Solutions

Enterprise customers can:
- Remove all branding
- Use custom domains
- Apply custom styling
- Add custom analytics

Contact sales for white label pricing.

## WordPress Plugin

### Installation

1. Download the plugin from [WordPress.org](https://wordpress.org/plugins/calculator-widgets)
2. Upload to `/wp-content/plugins/`
3. Activate the plugin
4. Go to Settings > Calculator Widgets
5. Enter your API key

### Usage

Use shortcodes in posts and pages:

```
[calculator id="mortgage" theme="light"]
```

### Gutenberg Block

1. Add new block
2. Search for "Calculator"
3. Select calculator type
4. Configure options

## Shopify App

### Installation

1. Visit [Shopify App Store](https://apps.shopify.com/calculator-widgets)
2. Click "Add app"
3. Authorize the app
4. Select calculators to install

### Configuration

- Choose calculator types
- Set placement locations
- Customize appearance
- Configure conversion tracking

## Security

- All data is encrypted in transit
- No personal data is stored
- GDPR compliant
- SOC 2 Type II certified

## Rate Limits

| Plan | Requests/Month | Rate Limit |
|------|----------------|------------|
| Free | 10,000 | 100/hour |
| Pro | 100,000 | 1,000/hour |
| Enterprise | Unlimited | Custom |

## Support

- Documentation: [docs.yourcalculatorsite.com](https://docs.yourcalculatorsite.com)
- Email Support: support@yourcalculatorsite.com
- Live Chat: Available 24/7 for Pro+ customers
- Phone Support: Enterprise customers only

## Changelog

### v2.0.0 (Latest)
- New widget engine with improved performance
- Enhanced mobile support
- Advanced analytics
- WordPress and Shopify integrations
- GraphQL API support

### v1.5.0
- Dark theme support
- Custom CSS options
- Improved accessibility
- Bug fixes and performance improvements

### v1.0.0
- Initial release
- Basic widget functionality
- REST API
- HTML embed support
