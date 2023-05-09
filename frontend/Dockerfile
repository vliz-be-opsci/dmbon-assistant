# ==== CONFIGURATION ====
# Base image
# Use node 18-alpine as base image
FROM node:18-alpine

# install yarn 
#RUN npm install -g yarn
# Set working directory
WORKDIR /app
# Copy app files
COPY . .
# ==== BUILD ====
# Install dependencies with yarn
RUN yarn install

# Build app
RUN yarn rw build web

# ==== RUN ====
EXPOSE 8910

CMD ["npx", "serve", "web/dist", "-p", "8910"]