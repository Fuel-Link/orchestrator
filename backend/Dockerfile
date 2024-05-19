FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY entrypoint.sh .
COPY check_topics.sh .

RUN apt-get update

RUN apt-get install -y dos2unix && dos2unix entrypoint.sh && dos2unix check_topics.sh

RUN chmod a+x entrypoint.sh

RUN chmod a+x check_topics.sh

ENTRYPOINT "./entrypoint.sh"