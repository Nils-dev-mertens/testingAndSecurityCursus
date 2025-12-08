# Use Node image for build stage
FROM node:20-bookworm AS builder

WORKDIR /app

# Copy project files
COPY gitbook/ .

# Install dependencies
RUN npm install

# Build the production-ready app
RUN npm run build

# ---------------------------
# Use a lightweight web server to serve the build
# ---------------------------
FROM nginx:alpine

# Copy built files from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Copy custom Nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
