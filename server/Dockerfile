FROM node:18.18.2-alpine

# Set working directory
WORKDIR /app

# Copy and download dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the source files into the image
COPY . .

# open port 80
EXPOSE 80

CMD [ "npm","start"]