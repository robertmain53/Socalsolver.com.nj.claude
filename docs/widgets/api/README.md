# Calculator Widget API Documentation

## Authentication

All API requests require authentication using API keys.

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     https://api.yourcalculatorsite.com/v2/calculators
```

## Rate Limiting

API requests are rate limited based on your subscription plan:

- **Free**: 100 requests/hour
- **Pro**: 1,000 requests/hour  
- **Enterprise**: Custom limits

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```

## Endpoints

### Get Calculator List

```http
GET /api/v2/calculators
```

**Response:**
```json
{
  "calculators": [
    {
      "id": "mortgage",
      "title": "Mortgage Calculator",
      "description": "Calculate monthly payments",
      "category": "finance",
      "featured": true
    }
  ],
  "total": 50,
  "page": 1,
  "pages": 5
}
```

### Get Calculator Details

```http
GET /api/v2/calculators/{id}
```

**Response:**
```json
{
  "id": "mortgage",
  "title": "Mortgage Calculator",
  "description": "Calculate monthly mortgage payments",
  "inputs": [
    {
      "id": "principal",
      "type": "number",
      "label": "Loan Amount",
      "required": true,
      "min": 1000,
      "max": 10000000
    }
  ],
  "formula": "PMT(rate/12, term*12, -principal)",
  "outputs": [
    {
      "id": "payment",
      "label": "Monthly Payment",
      "format": "currency"
    }
  ]
}
```

### Perform Calculation

```http
POST /api/v2/calculate
```

**Request:**
```json
{
  "calculatorId": "mortgage",
  "inputs": {
    "principal": 300000,
    "rate": 3.5,
    "term": 30
  },
  "format": "detailed"
}
```

**Response:**
```json
{
  "result": {
    "payment": 1347.13,
    "totalPaid": 484963.99,
    "totalInterest": 184963.99
  },
  "formatted": {
    "payment": "$1,347.13",
    "totalPaid": "$484,963.99",
    "totalInterest": "$184,963.99"
  },
  "breakdown": [
    {
      "year": 1,
      "principal": 8234.45,
      "interest": 8931.11,
      "balance": 291765.55
    }
  ]
}
```

### Generate Embed Code

```http
POST /api/v2/embed/generate
```

**Request:**
```json
{
  "calculatorId": "mortgage",
  "domain": "example.com",
  "options": {
    "theme": "light",
    "size": "medium",
    "branding": true
  }
}
```

**Response:**
```json
{
  "embedCode": "<iframe src='...' width='100%' height='500'></iframe>",
  "iframeUrl": "https://yourcalculatorsite.com/embed/iframe?...",
  "jsSnippet": "<script>new CalculatorWidget(...);</script>",
  "analytics": {
    "trackingId": "track_abc123"
  }
}
```

## Error Handling

All errors return a consistent format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input values",
    "details": {
      "field": "principal",
      "issue": "Value must be greater than 0"
    }
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `INVALID_API_KEY` | API key is missing or invalid |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `CALCULATOR_NOT_FOUND` | Calculator ID doesn't exist |
| `VALIDATION_ERROR` | Input validation failed |
| `CALCULATION_ERROR` | Error during calculation |
| `INTERNAL_ERROR` | Server error |

## GraphQL API

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
      validation {
        min
        max
        pattern
      }
    }
    outputs {
      id
      label
      format
    }
  }
}

mutation Calculate($input: CalculationInput!) {
  calculate(input: $input) {
    success
    result {
      ... on CalculationResult {
        values
        formatted
        breakdown
      }
      ... on CalculationError {
        message
        field
      }
    }
  }
}
```

## Webhooks

Configure webhooks to receive real-time notifications:

### Events

- `calculation.completed` - When a calculation is performed
- `widget.loaded` - When a widget is loaded
- `conversion.tracked` - When a conversion occurs
- `error.occurred` - When an error happens

### Configuration

```http
POST /api/v2/webhooks
```

```json
{
  "url": "https://yoursite.com/webhook",
  "events": ["calculation.completed"],
  "secret": "your_webhook_secret"
}
```

### Payload

```json
{
  "event": "calculation.completed",
  "timestamp": 1609459200,
  "data": {
    "calculatorId": "mortgage",
    "inputs": {...},
    "result": {...},
    "widget": {
      "id": "widget_abc123",
      "domain": "example.com"
    }
  }
}
```

## SDKs

### JavaScript/Node.js

```bash
npm install @your-calculator/sdk
```

```javascript
import { CalculatorClient } from '@your-calculator/sdk';

const client = new CalculatorClient({
  apiKey: 'your_api_key'
});

const result = await client.calculate('mortgage', {
  principal: 300000,
  rate: 3.5,
  term: 30
});
```

### Python

```bash
pip install your-calculator-sdk
```

```python
from your_calculator import CalculatorClient

client = CalculatorClient(api_key='your_api_key')

result = client.calculate('mortgage', {
    'principal': 300000,
    'rate': 3.5,
    'term': 30
})
```

### PHP

```bash
composer require your-calculator/sdk
```

```php
use YourCalculator\Client;

$client = new Client('your_api_key');

$result = $client->calculate('mortgage', [
    'principal' => 300000,
    'rate' => 3.5,
    'term' => 30
]);
```

## Testing

Use our test environment for development:

- **Base URL**: `https://api-test.yourcalculatorsite.com`
- **Test API Key**: `test_key_123456789`

Test calculators are available with the prefix `test_`.

## Status Page

Monitor API status at [status.yourcalculatorsite.com](https://status.yourcalculatorsite.com)
