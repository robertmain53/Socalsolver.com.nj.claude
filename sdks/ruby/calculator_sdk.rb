# Calculator API SDK for Ruby
# Full-featured Ruby SDK with error handling and caching

require 'net/http'
require 'json'
require 'uri'

class CalculatorSDK
  class Error < StandardError; end
  class APIError < Error
    attr_reader :status_code, :response_data
    
    def initialize(message, status_code = nil, response_data = nil)
      super(message)
      @status_code = status_code
      @response_data = response_data
    end
  end

  def initialize(api_key, base_url: 'https://api.yourcalculatorsite.com/v2', timeout: 30, retries: 3, debug: false)
    @api_key = api_key
    @base_url = base_url
    @timeout = timeout
    @retries = retries
    @debug = debug
    @cache = {}
  end

  def get_calculators(options = {})
    query_string = options.empty? ? '' : "?#{URI.encode_www_form(options)}"
    request('GET', "/calculators#{query_string}")
  end

  def calculate(input)
    data = input.is_a?(Hash) ? input : input.to_h
    request('POST', '/calculate', data)
  end

  private

  def request(method, endpoint, data = nil)
    uri = URI("#{@base_url}#{endpoint}")
    
    @retries.times do |attempt|
      begin
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = uri.scheme == 'https'
        http.read_timeout = @timeout

        case method
        when 'GET'
          request = Net::HTTP::Get.new(uri)
        when 'POST'
          request = Net::HTTP::Post.new(uri)
          request.body = data.to_json if data
        end

        request['Authorization'] = "Bearer #{@api_key}"
        request['Content-Type'] = 'application/json'
        request['User-Agent'] = 'CalculatorSDK-Ruby/2.0.0'

        puts "[CalculatorSDK] #{method} #{uri}" if @debug

        response = http.request(request)

        unless response.is_a?(Net::HTTPSuccess)
          error_data = JSON.parse(response.body) rescue {}
          error_message = error_data['error'] || response.message
          raise APIError.new("API Error #{response.code}: #{error_message}", response.code.to_i, error_data)
        end

        result = JSON.parse(response.body)
        puts "[CalculatorSDK] Response: #{result}" if @debug
        
        return result

      rescue => error
        if attempt < @retries - 1
          delay = 2 ** attempt
          puts "[CalculatorSDK] Attempt #{attempt + 1} failed, retrying in #{delay}s: #{error.message}" if @debug
          sleep(delay)
        else
          raise error
        end
      end
    end
  end
end

# Example usage:
# sdk = CalculatorSDK.new('your_api_key', debug: true)
# calculators = sdk.get_calculators(category: 'finance')
# result = sdk.calculate(calculatorId: 'mortgage', inputs: { principal: 300000, rate: 3.5, term: 30 })
