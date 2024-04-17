FROM kafka-streams_base-application:1.0

# Copy our application
COPY PlateRecognizer.java src/main/java/applications/PlateRecognizer.java
COPY WordCount.java src/main/java/applications/WordCount.java
copy Token.java src/main/java/applications/Token.java

# Add JSON processing library
RUN ["sh", "add_mvn_dependency.sh", "com.fasterxml.jackson.core", "jackson-databind", "2.12.5"]

# Add Apache HttpClient library 
RUN ["sh", "add_mvn_dependency.sh", "org.apache.httpcomponents", "httpclient", "4.5.13"]

# Add Apache HttpMime library
RUN ["sh", "add_mvn_dependency.sh", "org.apache.httpcomponents", "httpmime", "4.5.13"]

# Add Apache Commons IO library
RUN ["sh", "add_mvn_dependency.sh", "commons-io", "commons-io", "2.11.0"]

# Build the application
RUN mvn clean package

#SHELL ["/bin/bash", "-c"]

#ENTRYPOINT mvn exec:java -Dexec.mainClass=applications.PlateRecognizer