from flask import jsonify

def api_response(data=None, message=None, status=200):
    """
    Create a standardized API response with the given data and message.
    
    Args:
        data: The data to include in the response (optional)
        message: A message about the response (optional)
        status: HTTP status code (default: 200)
    
    Returns:
        A Flask response object with the JSON data and status code
    """
    response = {
        'status': 'success' if status < 400 else 'error',
    }
    
    if data is not None:
        response['data'] = data
    
    if message is not None:
        response['message'] = message
    
    return jsonify(response), status

def validation_error(errors):
    """
    Create a validation error response with the given errors.
    
    Args:
        errors: A dictionary of field names to error messages
    
    Returns:
        A Flask response object with the validation errors and a 400 status code
    """
    return api_response(
        data={'errors': errors},
        message='Validation error',
        status=400
    ) 