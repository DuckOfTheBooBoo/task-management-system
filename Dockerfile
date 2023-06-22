FROM node:18-alpine
RUN apk update && apk add git
WORKDIR /run
RUN git clone https://github.com/DuckOfTheBooBoo/task-management-system
WORKDIR /run/task-management-system
RUN npm i .
ENTRYPOINT [ "npm", "run", "start"]
