# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json yarn.lock ./

# Install project dependencies
RUN yarn install

# Copy the rest of the project files to the container
COPY . .

# Build the React app
RUN yarn build

# Expose the port that the server will listen on
EXPOSE 5173

# Start the application
CMD [ "yarn", "preview" ]