FROM node:20-alpine AS build-service
WORKDIR /app
COPY . /app/
RUN npm -g install pnpm@9.14.2
RUN pnpm install
ENV VITE_ORIGIN_URL=/api
RUN pnpm --filter web build

FROM nginx:latest AS web-service
COPY --from=build-service /app/dist /usr/share/nginx/html
COPY web/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
