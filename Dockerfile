# Use an official Node.js 18 runtime as a base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (to use Docker cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the ports for Next.js (3000) and Mock API (4000)
EXPOSE 3000 4000

# Default command (Docker Compose overrides this)
CMD ["npm", "run", "dev"]
