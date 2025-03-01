
FROM node:14-alpine as development

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . ./

ENV DATABASE_NAME=''
ENV DATABASEL_USER=''
ENV DATABASE_PASSWORD=''
ENV DATABASE_URL=""

EXPOSE 80

CMD ["npm", "start"]

# RUN npm run build

# FROM --platform=linux/amd64 node as production

# WORKDIR /app

# COPY package*.json .

# RUN npm install --only=production

# COPY --from=development /app/build ./build

# CMD ["node", "build/server.js"]

