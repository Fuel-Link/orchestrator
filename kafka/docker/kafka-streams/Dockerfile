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
#COPY plate-recognizer.java src/main/java/applications/plate-recognizer.java

# Copy the check topics script
COPY check_topics.sh .
RUN mvn clean package

#SHELL ["/bin/bash", "-c"]

#ENTRYPOINT mvn exec:java -Dexec.mainClass=applications.WordCount

#COPY WordCountApplication.java .

#COPY init.sh .
#RUN ["chmod", "+x", "/app/init.sh"]

#EXPOSE 8080
#CMD ["sh", "init.sh"]