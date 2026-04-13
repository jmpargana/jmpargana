import json
import boto3

def respond(code, msg):
    return {
        "statusCode": code,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,HEAD,PATCH",
            "Content-Type": "application/json"
        },
        "body": json.dumps({
            "message": msg,
        }),
    }

def get_table():
    ddb = boto3.resource('dynamodb', region_name='eu-west-1')
    return ddb.Table('jmpargana-newsletter')