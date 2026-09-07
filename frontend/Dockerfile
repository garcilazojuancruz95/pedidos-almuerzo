FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Vite loads frontend/.env.docker in this explicit build mode. Keeping this
# configuration in the frontend prevents Compose from resolving ANON_KEY from
# an unrelated root .env file.
RUN npm run build -- --mode docker


FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
