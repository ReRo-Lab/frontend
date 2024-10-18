
# Builder container for front-end
FROM node:22 AS builder

WORKDIR /app

# Copy the requirements for building
COPY package*.json ./
COPY . .

# Build packages
RUN npm install
RUN npm run build


# Runner container for front-end
FROM node:22 AS runner

WORKDIR /app

# Copy contents from the builder container
COPY --from=builder /app ./

# Expose port for server and run
EXPOSE 3000
CMD ["npm", "run", "start"]