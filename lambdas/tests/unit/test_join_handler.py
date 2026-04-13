import json

import pytest

from unittest.mock import patch, MagicMock, ANY
from ...src import join


@pytest.fixture()
def apigw_event():
    """ Generates API GW Event"""

    def _build_event(body: dict):
        return {
            "body": json.dumps(body),
            "resource": "/{proxy+}",
            "requestContext": {
                "resourceId": "123456",
                "apiId": "1234567890",
                "resourcePath": "/{proxy+}",
                "httpMethod": "POST",
                "requestId": "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
                "accountId": "123456789012",
                "identity": {
                    "apiKey": "",
                    "userArn": "",
                    "cognitoAuthenticationType": "",
                    "caller": "",
                    "userAgent": "Custom User Agent String",
                    "user": "",
                    "cognitoIdentityPoolId": "",
                    "cognitoIdentityId": "",
                    "cognitoAuthenticationProvider": "",
                    "sourceIp": "127.0.0.1",
                    "accountId": "",
                },
                "stage": "prod",
            },
            "queryStringParameters": {"foo": "bar"},
            "headers": {
                "Via": "1.1 08f323deadbeefa7af34d5feb414ce27.cloudfront.net (CloudFront)",
                "Accept-Language": "en-US,en;q=0.8",
                "CloudFront-Is-Desktop-Viewer": "true",
                "CloudFront-Is-SmartTV-Viewer": "false",
                "CloudFront-Is-Mobile-Viewer": "false",
                "X-Forwarded-For": "127.0.0.1, 127.0.0.2",
                "CloudFront-Viewer-Country": "US",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Upgrade-Insecure-Requests": "1",
                "X-Forwarded-Port": "443",
                "Host": "1234567890.execute-api.us-east-1.amazonaws.com",
                "X-Forwarded-Proto": "https",
                "X-Amz-Cf-Id": "aaaaaaaaaae3VYQb9jd-nvCd-de396Uhbp027Y2JvkCPNLmGJHqlaA==",
                "CloudFront-Is-Tablet-Viewer": "false",
                "Cache-Control": "max-age=0",
                "User-Agent": "Custom User Agent String",
                "CloudFront-Forwarded-Proto": "https",
                "Accept-Encoding": "gzip, deflate, sdch",
            },
            "pathParameters": {"proxy": "/examplepath"},
            "httpMethod": "POST",
            "stageVariables": {"baz": "qux"},
            "path": "/examplepath",
        }
    return _build_event


@pytest.mark.parametrize(
    "body,expected_code,expected_message",
    [
        ({"email": "random"}, 400, "Invalid email provided."),
        ({"random": "random"}, 500, "internal server error"),
    ]
)
def test_lambda_handler_invalid_input(apigw_event, body, expected_code, expected_message):
    event = apigw_event(body)
    ret = join.lambda_handler(event, "")
    data = json.loads(ret["body"])

    assert ret["statusCode"] == expected_code
    assert "message" in data
    assert data["message"] == expected_message

def test_lambda_handler_happy_path(apigw_event):
    body = {"email": "test@example.com"}
    event = apigw_event(body)

    fake_table = MagicMock()
    fake_table.put_item.return_value = {"ResponseMetadata": {"HTTPStatusCode": 200}}
    fake_table.get_item.return_value = {"Item": []}

    with patch("src.app.boto3.resource") as mock_resource:
        mock_resource.return_value.Table.return_value = fake_table
        response = join.lambda_handler(event, "")

        fake_table.put_item.assert_called_once_with(Item={"Email": "test@example.com", 'Token': ANY})
        fake_table.get_item.assert_called_once()
        data = json.loads(response["body"])
        assert response["statusCode"] == 201
        assert data["message"] == "successfully added to the newsletter"

def test_lambda_handler_fail_if_mail_already_available(apigw_event):
    body = {"email": "test@example.com"}
    event = apigw_event(body)

    fake_table = MagicMock()
    fake_table.put_item.return_value = {"ResponseMetadata": {"HTTPStatusCode": 200}}
    fake_table.get_item.return_value = {"Item": [{'Email': 'something'}]}

    with patch("src.app.boto3.resource") as mock_resource:
        mock_resource.return_value.Table.return_value = fake_table
        response = join.lambda_handler(event, "")

        fake_table.get_item.assert_called_once()
        fake_table.put_item.assert_not_called()
        data = json.loads(response["body"])
        assert response["statusCode"] == 400
        assert data["message"] == "Email already registered."