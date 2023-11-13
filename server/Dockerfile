FROM node:18.18.2-alpine

RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . .
RUN npm install
COPY src/ .
EXPOSE 80
CMD [ "npm", "start"]