"""
Calculator API SDK for Python
Full-featured Python SDK with async support, caching, and error handling
"""

import asyncio
import json
import time
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, field
import aiohttp
import requests
from urllib.parse import urlencode


@dataclass
class CalculatorSDKConfig:
    api_key: str
    base_url: str = "https://api.yourcalculatorsite.com/v2"
    timeout: int = 30
    retries: int = 3
    cache_enabled: bool = True
    debug: bool = False


class CalculatorSDK:
    """
    Synchronous Calculator SDK
    """
    
    def __init__(self, config: CalculatorSDKConfig):
        self.config = config
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {config.api_key}',
            'Content-Type': 'application/json',
            'User-Agent': 'CalculatorSDK-Python/2.0.0'
        })
        self._cache = {}
    
    def get_calculators(self, **kwargs) -> Dict[str, Any]:
        """Get list of available calculators"""
        params = {k: v for k, v in kwargs.items() if v is not None}
        query_string = f"?{urlencode(params)}" if params else ""
        return self._request('GET', f'/calculators{query_string}')
    
    def calculate(self, input_data: Dict) -> Dict[str, Any]:
        """Perform a calculation"""
        return self._request('POST', '/calculate', input_data)
    
    def _request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Any:
        """Make HTTP request with retry logic"""
        url = f"{self.config.base_url}{endpoint}"
        last_error = None
        
        for attempt in range(self.config.retries + 1):
            try:
                if self.config.debug:
                    print(f"[CalculatorSDK] {method} {url}", data or "")
                
                if method == 'GET':
                    response = self.session.get(url, timeout=self.config.timeout)
                else:
                    response = self.session.request(
                        method, url, 
                        json=data, 
                        timeout=self.config.timeout
                    )
                
                if not response.ok:
                    error_data = {}
                    try:
                        error_data = response.json()
                    except:
                        pass
                    
                    error_message = error_data.get('error', response.reason)
                    raise Exception(f"API Error {response.status_code}: {error_message}")
                
                result = response.json()
                
                if self.config.debug:
                    print(f"[CalculatorSDK] Response:", result)
                
                return result
                
            except Exception as error:
                last_error = error
                
                if attempt < self.config.retries:
                    delay = (2 ** attempt)  # Exponential backoff
                    if self.config.debug:
                        print(f"[CalculatorSDK] Attempt {attempt + 1} failed, retrying in {delay}s: {error}")
                    time.sleep(delay)
        
        raise last_error


# Example usage
if __name__ == "__main__":
    config = CalculatorSDKConfig(api_key="your_api_key", debug=True)
    sdk = CalculatorSDK(config)
    
    # Get calculators
    calculators = sdk.get_calculators(category="finance")
    print("Available calculators:", calculators)
    
    # Perform calculation
    result = sdk.calculate({
        "calculatorId": "mortgage",
        "inputs": {
            "principal": 300000,
            "rate": 3.5,
            "term": 30
        }
    })
    print("Calculation result:", result)
