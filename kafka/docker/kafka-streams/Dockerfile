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

# Copy the check topics script
COPY check_topics.sh .
RUN ["chmod", "a+x", "check_topics.sh"]

# Copy the add mvn dependency script
COPY add_mvn_dependency.sh .
RUN ["chmod", "a+x", "add_mvn_dependency.sh"]
