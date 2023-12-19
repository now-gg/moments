from flask import jsonify, make_response

def get_security_headers():
    return {
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'X-Content-Type-Options': 'nosniff',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': "default-src 'self'",
        'Referrer-Policy': 'no-referrer',
    }


def send_response(data, status_code, headers=None):
    if status_code in [200, 201]:
        data["status"] = "success"
    else:
        data["status"] = "error"
    response_headers = get_security_headers()
    if headers:
        response_headers = {**response_headers, **headers}
    return make_response(jsonify(data), status_code, response_headers)