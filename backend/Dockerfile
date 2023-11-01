# Use an official Python runtime as a parent image
FROM python:3.11.0

# Install build tools and dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    yasm \
    pkg-config \
    libx264-dev \
    libfreetype6-dev \
    libmp3lame-dev \
    libopus-dev

# Set the working directory to /src
WORKDIR /src

# Compile and install FFmpeg 2.8.22
RUN wget https://ffmpeg.org/releases/ffmpeg-2.8.22.tar.gz && \
    tar -xzf ffmpeg-2.8.22.tar.gz && \
    cd ffmpeg-2.8.22 && \
    ./configure --enable-libx264 --enable-libmp3lame --enable-libopus --enable-nonfree --enable-gpl && \
    make && \
    make install

# Clean up the source files
RUN rm -rf /src

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