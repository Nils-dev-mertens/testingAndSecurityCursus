FROM node:20-bookworm

WORKDIR /app

# Copy project files
COPY gitbook/ .

# Install dependencies
RUN npm install

# Run Vite prebuild step (your custom script)
RUN npm run prebuild

# Vite dev server default port
EXPOSE 5173

# Start Vite dev server (must bind to 0.0.0.0 for Docker)
CMD ["npm", "run", "dev", "--", "--host"]
