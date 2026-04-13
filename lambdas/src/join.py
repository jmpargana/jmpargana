import json
import uuid
import re
import logging
from botocore.exceptions import ClientError
from utils import respond, get_table

# boto3.set_stream_logger('botocore', level="DEBUG")
logging.getLogger('botocore').setLevel(logging.DEBUG)

EMAIL_REGEX = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
TABLE = get_table()

def lambda_handler(event, _):
    try:
        body = json.loads(event['body'])
        email = body.get('email')
        
        if not email or not validate_email(email):
            return respond(400, "Invalid email provided" )
            
        if email_exists(email):
            return respond(400, "Email already registered" )
        
        add_email(email)
        return respond(201, "successfully added to the newsletter")
    except (json.JSONDecodeError, KeyError):
        return respond(400, "Malformed request payload")
    except ClientError as e:
        logging.error(f"DynamoDB Error: {e}")
        return respond(500, "Database error")
    except Exception as e:
        logging.exception(f"Unexpected error occurred, {e}")
        return respond(500, "Internal server error")

def email_exists(email):
    try:
        response = TABLE.get_item(Key={"Email": email})
        return "Item" in response
    except ClientError as e:
        logging.error(f"Failed to check email exists: {e}")
        raise
    
def add_email(email):
    TABLE.put_item(Item={
        "Email": email,
        "Token": uuid.uuid4().hex
    })

def validate_email(email):
    return re.fullmatch(EMAIL_REGEX, email)    
