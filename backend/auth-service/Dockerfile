# Build stage
FROM node:14-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install

# Production stage
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
EXPOSE 5001
CMD ["npm", "start"]  # 

#FROM node:14-alpine
#WORKDIR /app
#COPY package.json ./
#RUN npm install
#COPY src ./src
#EXPOSE 5001
#CMD ["npm", "start"]
