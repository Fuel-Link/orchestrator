# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY ./consumer_http_client.py ./consumer_http_client.py

# Install any needed packages specified in requirements.txt
COPY ./requirements.txt ./requirements.txt
RUN pip3 install --no-cache-dir -r ./requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run consumer_http_client.py when the container launches
# Sleep for 30 seconds and then launch the python program
CMD ["sh", "-c", "sleep 30 && python3 consumer_http_client.py"]
