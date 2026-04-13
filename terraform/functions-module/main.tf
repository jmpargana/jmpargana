variable "type" {}

variable "method" {}

variable "lambda_uri" {}

variable "lambda_name" {}

variable "auth" {}

variable "rest_api_id" {}

variable "resource_id" {}

variable "api_gateway_region" {
  default = "eu-west-1"
}


resource "aws_api_gateway_method" "name" {
  rest_api_id   = var.rest_api_id
  resource_id   = var.resource_id
  http_method   = var.method
  authorization = var.auth
}

resource "aws_api_gateway_integration" "name" {
  rest_api_id             = var.rest_api_id
  resource_id             = var.resource_id
  http_method             = aws_api_gateway_method.name.http_method
  type                    = var.type
  integration_http_method = var.method
  uri                     = var.lambda_uri
}

# Add method response with CORS headers
resource "aws_api_gateway_method_response" "success" {
  rest_api_id     = var.rest_api_id
  resource_id     = var.resource_id
  http_method     = aws_api_gateway_method.name.http_method
  status_code     = "200"
  response_models = { "application/json" = "Empty" }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = true
    "method.response.header.Access-Control-Allow-Headers" = true
  }
}

# Add integration response with CORS headers for 200
resource "aws_api_gateway_integration_response" "success" {
  rest_api_id = var.rest_api_id
  resource_id = var.resource_id
  http_method = aws_api_gateway_method.name.http_method
  status_code = "200"
  response_templates = {
    "application/json" = ""
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
  }

  depends_on = [aws_api_gateway_method_response.success]
}

data "aws_caller_identity" "current" {}

resource "aws_lambda_permission" "apigw_lambda_add" {
  statement_id  = "AllowExecutionFromAPIGateway-${var.lambda_name}"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.api_gateway_region}:${data.aws_caller_identity.current.account_id}:${var.rest_api_id}/*/${aws_api_gateway_method.name.http_method}/*"
}

output "resource_id" {
  value = aws_api_gateway_integration.name.id
}

output "method_id" {
  value = aws_api_gateway_method.name.id
}
