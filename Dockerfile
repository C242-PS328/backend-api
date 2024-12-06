# Base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy application files into the container
COPY . .

# Install dependencies
RUN npm install

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Copy .env file
COPY .env .env

# Expose the application port (optional)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
