terraform {
  backend "s3" {}
}

provider "aws" {
  region = "eu-west-1"
}

variable "name" {
  default = "jmpargana-newsletter"
}

# module "remote_state" {
#   source = "../state-module"
#   name   = var.name
# }

resource "aws_dynamodb_table" "newsletter" {
  name         = var.name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "Email"

  attribute {
    name = "Email"
    type = "S"
  }

  ttl {
    attribute_name = "TimeToExist"
    enabled        = true
  }

  tags = {
    Name = format("%s-dynamo-mails", var.name)
  }
}

data "aws_iam_policy_document" "allow_dynamo" {
  statement {
    sid       = "SidToOverride"
    effect    = "Allow"
    actions   = ["dynamodb:*"]
    resources = ["*"]
  }
}

data "aws_iam_policy_document" "allow_lambda" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "role" {
  name               = format("%s-lambda-execution-role", var.name)
  assume_role_policy = data.aws_iam_policy_document.allow_lambda.json
}

resource "aws_iam_policy" "policy" {
  name   = format("%s-lambda-to-dynamo", var.name)
  policy = data.aws_iam_policy_document.allow_dynamo.json
}

resource "aws_iam_role_policy_attachment" "policy_attachment" {
  role       = aws_iam_role.role.name
  policy_arn = aws_iam_policy.policy.arn
}

data "archive_file" "zip" {
  type        = "zip"
  source_dir  = "../../lambdas/src"
  output_path = "${path.module}/lambda/function.zip"
}

resource "aws_lambda_function" "add_user" {
  filename         = data.archive_file.zip.output_path
  function_name    = format("%s-add-user", var.name)
  role             = aws_iam_role.role.arn
  handler          = "join.lambda_handler"
  source_code_hash = data.archive_file.zip.output_base64sha256
  runtime          = "python3.12"
}

resource "aws_lambda_function" "delete_user" {
  filename         = data.archive_file.zip.output_path
  function_name    = format("%s-leave-user", var.name)
  role             = aws_iam_role.role.arn
  handler          = "leave.lambda_handler"
  source_code_hash = data.archive_file.zip.output_base64sha256
  runtime          = "python3.12"
}


resource "aws_ses_template" "name" {
  name = var.name 
  subject = "Freshly backed blog post"
  html = file("${path.module}/template.html")
}


# resource "aws_lambda_function" "broadcast" {
#   filename         = data.archive_file.zip.output_path
#   function_name    = format("%s-leave-user", var.name)
#   role             = aws_iam_role.role.arn
#   handler          = "broadcast.lambda_handler"
#   source_code_hash = data.archive_file.zip.output_base64sha256
#   runtime          = "python3.12"
# }

output "api_gateway_invoke_url" {
  value = aws_api_gateway_stage.name.invoke_url
}
