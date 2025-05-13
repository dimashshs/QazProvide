# Базовый образ
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .


RUN npm run build


EXPOSE 3000
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
