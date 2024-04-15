#!/bin/bash

# Check if three arguments are provided
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 groupId artifactId version"
    exit 1
fi

# Assign arguments to variables
groupId="$1"
artifactId="$2"
version="$3"

# Format dependency XML
dependency="\\\t<dependency>\n\t\t<groupId>${groupId}</groupId>\n\t\t<artifactId>${artifactId}</artifactId>\n\t\t<version>${version}</version>\n\t</dependency>"

# Check if pom.xml exists
if [ -f "pom.xml" ]; then
    # Insert dependency before the closing tag </dependencies>
    sed -i "/<\/dependencies>/i ${dependency}" pom.xml

    echo "Dependency added to pom.xml:"
    echo -e "${dependency}"
else
    echo "pom.xml file not found."
    exit 1
fi
