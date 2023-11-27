FROM node:18.18.2-alpine

# Set working directory
WORKDIR /app

# Copy and download dependencies
COPY package.json ./
RUN npm install

# Copy the source files into the image
COPY . .

# open port 3000
EXPOSE 3000

CMD [ "npm","start"]