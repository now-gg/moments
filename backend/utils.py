import os
import time

def get_upload_file_path(filename, action):
    time_string = time.strftime("%Y%m%d-%H%M%S")
    file_extension = filename.split(".")[-1]
    new_video_name = filename.replace(f".{file_extension}", f"_{action}_{time_string}.{file_extension}")
    new_video_path = os.path.join("static/videos", new_video_name)
    return new_video_path


def save_input_video(video):
    video_path = os.path.join("static/videos", video.filename)
    video.save(video_path)
    return video_path


def get_operation(trim, crop):
    if trim and crop:
        return "both"
    elif trim:
        return "trim"
    elif crop:
        return "crop"
    else:
        return ""