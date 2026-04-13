locals {
  fns = [
    {
      method      = "POST"
      auth        = "NONE"
      type        = "AWS_PROXY"
      lambda_name = aws_lambda_function.add_user.function_name
      lambda_uri  = "arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/${aws_lambda_function.add_user.arn}/invocations"
    },
    {
      method      = "DELETE"
      auth        = "NONE"
      type        = "AWS_PROXY"
      lambda_name = aws_lambda_function.delete_user.function_name
      lambda_uri  = "arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/${aws_lambda_function.delete_user.arn}/invocations"
    },
  ]
}

module "lambdas" {
  source   = "../functions-module"
  for_each = { for i, fn in local.fns : fn.lambda_name => fn }

  rest_api_id = aws_api_gateway_rest_api.name.id
  resource_id = aws_api_gateway_resource.name.id

  method      = each.value.method
  auth        = each.value.auth
  type        = each.value.type
  lambda_name = each.value.lambda_name
  lambda_uri  = each.value.lambda_uri
}

# Enable CORS on the API Gateway resource
module "cors" {
  source = "../cors-module"

  rest_api_id = aws_api_gateway_rest_api.name.id
  resource_id = aws_api_gateway_resource.name.id

  # Bypass all CORS restrictions - allow everything
  allowed_origins = ["*"]
  allowed_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"]
  allowed_headers = ["*"]
  expose_headers  = ["*"]
  max_age         = 3600
}


resource "aws_api_gateway_rest_api" "name" {
  name = var.name
}

resource "aws_api_gateway_resource" "name" {
  parent_id   = aws_api_gateway_rest_api.name.root_resource_id
  path_part   = "{proxy+}"
  rest_api_id = aws_api_gateway_rest_api.name.id
}


resource "aws_api_gateway_deployment" "name" {
  rest_api_id = aws_api_gateway_rest_api.name.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.name.id,
      [for module_instance in values(module.lambdas) : module_instance.resource_id],
      [for module_instance in values(module.lambdas) : module_instance.method_id],
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "name" {
  deployment_id = aws_api_gateway_deployment.name.id
  rest_api_id   = aws_api_gateway_rest_api.name.id
  stage_name    = var.name
}
