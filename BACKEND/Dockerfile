# using base image of nodejs
FROM node:18

# set working dir inside container
WORKDIR /app

# Copy dependency files
COPY package.json ./

# Install dependency
RUN npm install

# Copy all backend source code
COPY . .

# Port expose
EXPOSE 4000

# start the server
CMD ["node", "server.js"]
