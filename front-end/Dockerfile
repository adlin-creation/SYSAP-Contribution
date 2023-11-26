
# Use an official Node.js runtime as a parent image
FROM node:18.18.2-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Expose the port that the app will run on
EXPOSE 8081

# Start the Metro bundler and the app
CMD ["yarn", "web"]
