# Stage 1: Build the Create React App
#------------------------------------------------
FROM node:20.15.1-slim AS builder

# Set the working directory
WORKDIR /app

# This ARG will get its value from docker-compose.yaml
# Note: Changed from VITE_API_URL to REACT_APP_API_URL
ARG REACT_APP_API_URL
# Set the ENV var so 'npm run build' can use it
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Run the build command (it's the same command name as Vite)
RUN npm run build

# Stage 2: Serve the static files with Nginx
#------------------------------------------------
FROM nginx:1.27.0-alpine

# Ensure the base Alpine packages are updated to pick up security fixes
RUN apk update && apk upgrade --no-cache

# [CRITICAL CHANGE]
# Copy the build output from Stage 1
# Note: Changed from /app/dist to /app/build
COPY --from=builder /app/build /usr/share/nginx/html

# [CRITICAL STEP]
# Copy the custom Nginx config file
# This file is needed to make sure your Single Page App (SPA)
# routing works correctly.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx's default port
EXPOSE 80