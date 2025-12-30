FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build frontend
RUN npm run build

# Expose the API port
EXPOSE 3000

# Start server
CMD [ "node", "server.js" ]
