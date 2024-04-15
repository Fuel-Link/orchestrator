FROM confluentinc/cp-kafka:latest

USER root

RUN mkdir app 

WORKDIR "/app" 

RUN ["yum", "update", "-y"]

RUN ["yum", "install", "maven", "-y"]

RUN mvn archetype:generate \
    -DarchetypeGroupId=org.apache.kafka \
    -DarchetypeArtifactId=streams-quickstart-java \
    -DarchetypeVersion=3.7.0 \
    -DgroupId=streams.applications \
    -DartifactId=kafka-streams\
    -Dversion=0.1 \
    -Dpackage=applications

WORKDIR "/app/kafka-streams"

# Remove previous examples
RUN rm src/main/java/applications/*.java

# Copy our application
COPY WordCount.java src/main/java/applications/WordCount.java
COPY PlateRecognizer.java src/main/java/applications/PlateRecognizer.java

# Copy the check topics script
COPY check_topics.sh .
RUN ["chmod", "a+x", "check_topics.sh"]

# Copy the add mvn dependency script
COPY add_mvn_dependency.sh .
RUN ["chmod", "a+x", "add_mvn_dependency.sh"]
RUN ["sh", "add_mvn_dependency.sh", "com.fasterxml.jackson.core", "jackson-databind", "2.12.5"]

# Build the application
RUN mvn clean package

#SHELL ["/bin/bash", "-c"]

#ENTRYPOINT mvn exec:java -Dexec.mainClass=applications.WordCount

#COPY WordCountApplication.java .

#COPY init.sh .
#RUN ["chmod", "+x", "/app/init.sh"]

#EXPOSE 8080
#CMD ["sh", "init.sh"]