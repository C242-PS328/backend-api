# Base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists) first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

#Set the port for container
ENV PORT 3000

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
