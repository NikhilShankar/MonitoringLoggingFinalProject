FROM node:16 as build

WORKDIR /app

# Accept build argument for products URL
ARG PRODUCTS_URL=http://localhost:4201
ENV PRODUCTS_URL=${PRODUCTS_URL}

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist/shell /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
