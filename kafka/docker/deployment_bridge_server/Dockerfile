# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY ./mqtt_server_producer.py ./mqtt_server_producer.py

# Install any needed packages specified in requirements.txt
COPY ./requirements.txt /app/requirements.txt
RUN pip3 install --no-cache-dir -r /app/requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run mqtt_server_producer.py when the container launches
#CMD ["python3", "mqtt_server_producer.py"]
CMD ["sh", "-c", "sleep 5 && python3 -u mqtt_server_producer.py"]
