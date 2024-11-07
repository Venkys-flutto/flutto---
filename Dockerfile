# Use Node.js 18 as the base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy prisma schema
COPY prisma ./prisma/

# Install dependencies
RUN apt-get update && apt-get install -y openssl python3 make g++ \
    && npm install \
    && npm rebuild bcrypt --build-from-source \
    && npx prisma generate \
    && apt-get purge -y python3 make g++ \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]