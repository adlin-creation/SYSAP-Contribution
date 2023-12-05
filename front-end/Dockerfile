
# Use an official Node.js runtime as a parent image
FROM node:18.18.2-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json ./

# Install dependencies
RUN yarn install
RUN npm install -g @expo/ngrok@^4.1.0 expo
RUN expo login -u sysap2023 -p syp2023%%% --non-interactive

# Copy the rest of the application code to the container
COPY . .

# Expose the port that the app will run on
EXPOSE 8081

# Start the Metro bundler and the app
CMD ["yarn", "serve"]