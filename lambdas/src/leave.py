import logging
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Attr
from utils import respond, get_table

TABLE = get_table()

def lambda_handler(event, _):
    token = event.get('path')
    token = token.removeprefix('/newsletter/')
    if not token:
        logging.warning("Missing token in event path")
        return respond(400, "Token is required")

    logging.info(f"Request to delete token: {token}")

    try:
        response = TABLE.scan(FilterExpression=Attr('Token').eq(token)) 
        logging.info(f"response {response}")
        items = response.get('Items', [])
        
        if not items:
            logging.info(f"No item found with token: {token}")
            return respond(404, "Item not found")

        item = items[0]
        delete_response = TABLE.delete_item(Key={'Email': item['Email']})
        logging.info(f"Delete response: {delete_response}")

        return respond(204, "Deleted email from database")

    except ClientError as e:
        logging.error(f"DynamoDB error during delete: {e}")
        return respond(500, "Database error")

    except Exception as e:
        logging.exception(f"Unexpected error occurred: {e}")
        return respond(500, "Internal server error")