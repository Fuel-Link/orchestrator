FROM kafka-streams_base-application:1.0

# Copy our application
COPY PlateRecognizer.java src/main/java/applications/PlateRecognizer.java
COPY WordCount.java src/main/java/applications/WordCount.java

RUN ["sh", "add_mvn_dependency.sh", "com.fasterxml.jackson.core", "jackson-databind", "2.12.5"]

# Build the application
RUN mvn clean package

#SHELL ["/bin/bash", "-c"]

#ENTRYPOINT mvn exec:java -Dexec.mainClass=applications.PlateRecognizer