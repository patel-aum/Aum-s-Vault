FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY default.conf.template /etc/nginx/conf.d/default.conf.template

CMD sh -c "envsubst '\$AUTH_SERVICE_HOST \$AUTH_SERVICE_PORT \$CARD_SERVICE_HOST \$CARD_SERVICE_PORT \$USER_SERVICE_HOST \$USER_SERVICE_PORT \$TRANSACTIONS_SERVICE_HOST \$TRANSACTIONS_SERVICE_PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"

EXPOSE 80
