# Use an official Python runtime as a parent image
FROM python:3.11.0

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Expose the port that Gunicorn will listen on
EXPOSE 8000

# Define the entry point for the application
CMD ["waitress-serve", "--host", "0.0.0.0", "--port", "8080", "app:app"]