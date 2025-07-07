<?php

/**
 * Calculator API SDK for PHP
 * Full-featured PHP SDK with PSR-4 compliance and modern PHP features
 */

namespace CalculatorSDK;

use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class CalculatorSDKConfig
{
    public string $apiKey;
    public string $baseUrl;
    public int $timeout;
    public int $retries;
    public bool $cacheEnabled;
    public bool $debug;

    public function __construct(
        string $apiKey,
        string $baseUrl = 'https://api.yourcalculatorsite.com/v2',
        int $timeout = 30,
        int $retries = 3,
        bool $cacheEnabled = true,
        bool $debug = false
    ) {
        $this->apiKey = $apiKey;
        $this->baseUrl = $baseUrl;
        $this->timeout = $timeout;
        $this->retries = $retries;
        $this->cacheEnabled = $cacheEnabled;
        $this->debug = $debug;
    }
}

class CalculatorSDK
{
    private CalculatorSDKConfig $config;
    private Client $client;
    private array $cache = [];

    public function __construct(CalculatorSDKConfig $config)
    {
        $this->config = $config;
        
        $this->client = new Client([
            'base_uri' => $config->baseUrl,
            'timeout' => $config->timeout,
            'headers' => [
                'Authorization' => 'Bearer ' . $config->apiKey,
                'Content-Type' => 'application/json',
                'User-Agent' => 'CalculatorSDK-PHP/2.0.0'
            ]
        ]);
    }

    /**
     * Get list of available calculators
     */
    public function getCalculators(array $options = []): array
    {
        $queryString = !empty($options) ? '?' . http_build_query($options) : '';
        return $this->request('GET', '/calculators' . $queryString);
    }

    /**
     * Perform a calculation
     */
    public function calculate(array $input): array
    {
        return $this->request('POST', '/calculate', $input);
    }

    /**
     * Make HTTP request with retry logic
     */
    private function request(string $method, string $endpoint, ?array $data = null): array
    {
        $lastError = null;
        
        for ($attempt = 0; $attempt <= $this->config->retries; $attempt++) {
            try {
                if ($this->config->debug) {
                    error_log("[CalculatorSDK] {$method} {$endpoint} " . ($data ? json_encode($data) : ''));
                }

                $options = [];
                if ($data && $method !== 'GET') {
                    $options['json'] = $data;
                }

                $response = $this->client->request($method, $endpoint, $options);
                $body = $response->getBody()->getContents();
                $result = json_decode($body, true);
                
                if ($this->config->debug) {
                    error_log("[CalculatorSDK] Response: " . json_encode($result));
                }

                return $result;

            } catch (RequestException $e) {
                $lastError = $e;
                
                if ($attempt < $this->config->retries) {
                    $delay = pow(2, $attempt); // Exponential backoff
                    if ($this->config->debug) {
                        error_log("[CalculatorSDK] Attempt " . ($attempt + 1) . " failed, retrying in {$delay}s: " . $e->getMessage());
                    }
                    sleep($delay);
                }
            }
        }

        throw new Exception("API request failed: " . $lastError->getMessage());
    }
}

// Example usage:
/*
$config = new CalculatorSDKConfig('your_api_key', debug: true);
$sdk = new CalculatorSDK($config);

$calculators = $sdk->getCalculators(['category' => 'finance']);
print_r($calculators);

$result = $sdk->calculate([
    'calculatorId' => 'mortgage',
    'inputs' => [
        'principal' => 300000,
        'rate' => 3.5,
        'term' => 30
    ]
]);
print_r($result);
*/
