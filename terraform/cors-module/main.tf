variable "rest_api_id" {
  description = "The REST API ID"
  type        = string
}

variable "resource_id" {
  description = "The resource ID"
  type        = string
}

variable "allowed_origins" {
  description = "List of allowed origins for CORS"
  type        = list(string)
  default     = ["*"]
}

variable "allowed_methods" {
  description = "List of allowed HTTP methods for CORS"
  type        = list(string)
  default     = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"]
}

variable "allowed_headers" {
  description = "List of allowed headers for CORS"
  type        = list(string)
  default     = ["*"]
}

variable "expose_headers" {
  description = "List of headers to expose in CORS responses"
  type        = list(string)
  default     = ["*"]
}

variable "max_age" {
  description = "Maximum age of CORS preflight response in seconds"
  type        = number
  default     = 3600
}

# Create OPTIONS method for CORS preflight
resource "aws_api_gateway_method" "options" {
  rest_api_id      = var.rest_api_id
  resource_id      = var.resource_id
  http_method      = "OPTIONS"
  authorization    = "NONE"
  api_key_required = false
}

# Create mock integration for OPTIONS method
resource "aws_api_gateway_integration" "options" {
  rest_api_id          = var.rest_api_id
  resource_id          = var.resource_id
  http_method          = aws_api_gateway_method.options.http_method
  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_TEMPLATES"
  request_templates = {
    "application/json" = jsonencode({ statusCode = 200 })
  }
}

# Create method response for OPTIONS
resource "aws_api_gateway_method_response" "options_200" {
  rest_api_id     = var.rest_api_id
  resource_id     = var.resource_id
  http_method     = aws_api_gateway_method.options.http_method
  status_code     = "200"
  response_models = { "application/json" = "Empty" }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
    "method.response.header.Access-Control-Max-Age"       = true
  }
}

# Create integration response for OPTIONS
resource "aws_api_gateway_integration_response" "options_200" {
  rest_api_id = var.rest_api_id
  resource_id = var.resource_id
  http_method = aws_api_gateway_method.options.http_method
  status_code = aws_api_gateway_method_response.options_200.status_code
  response_templates = {
    "application/json" = ""
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'${join(", ", var.allowed_headers)}'"
    "method.response.header.Access-Control-Allow-Methods" = "'${join(", ", var.allowed_methods)}'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${join(", ", var.allowed_origins)}'"
    "method.response.header.Access-Control-Max-Age"       = "'${var.max_age}'"
  }

  depends_on = [aws_api_gateway_integration.options]
}

output "cors_enabled" {
  value       = true
  description = "Indicates that CORS has been enabled for this resource"
}
