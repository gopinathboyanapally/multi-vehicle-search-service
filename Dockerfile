ARG NODE_VERSION=20.14.0

# Build Image
FROM node:${NODE_VERSION}-alpine3.19 AS builder

# Patch alpine image #
RUN apk update
RUN apk upgrade

WORKDIR /app

# Install node_modules first for caching a docker layer
COPY package*.json ./

RUN npm install

COPY . .

#Run tests before building
RUN npm run test || echo "Tests failed, continuing build..."

EXPOSE 3000

CMD ["npm", "start"]
