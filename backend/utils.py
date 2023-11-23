def get_operation(trim, crop):
    if trim and crop:
        return "trim,crop"
    elif trim:
        return "trim"
    elif crop:
        return "crop"
    else:
        return ""