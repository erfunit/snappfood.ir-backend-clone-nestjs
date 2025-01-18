# Base image
FROM node:20 as build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install -g npm@11.0.0
RUN npm install

# Copy the rest of the application and build it
COPY . .
RUN npm run build

# Final image
FROM node:20

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --only=production

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
