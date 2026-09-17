# Use Node image for build stage
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Copy project files
COPY gitbook/ .

# Install the locked dependency tree. This stays a full install (not --omit=dev)
# because astro, @astrojs/check and tsx are devDependencies that the build needs.
RUN npm ci

# Build the production-ready app. npm runs the "prebuild" script (which writes
# the search index to public/tree.json) before "build" automatically.
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
