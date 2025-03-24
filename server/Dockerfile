# Use the official Alpine based image.
FROM oven/bun:1.2.2-alpine

# Set the working directory inside the container.
WORKDIR /app

# Copy the package.json and package-lock.json files.
COPY package.json bun.lock ./

# Install the dependencies.
RUN bun install

# Sets the environment.
ENV NODE_ENV=production
ENV APP_API_URL=3000

# Expose the port the app runs on.
EXPOSE 3000

# Copy the rest of the application code.
COPY . .

# Build the application.
RUN bun run build

# Start the application.
CMD ["bun", "start"]