TEsting

QazProvide

QazProvide - это веб-платформа для онлайн-торговли, предоставляющая удобные инструменты для продавцов и покупателей. Проект включает бэкенд на Node.js (Express.js) и фронтенд на React.

Структура проекта

backend/ - серверная часть (Node.js, Express, MongoDB)

frontend/ - клиентская часть (React, Redux, TailwindCSS)

socket/ - модуль для работы с WebSocket (реализация чатов и уведомлений)

Требования

Перед запуском убедитесь, что у вас установлены:

Node.js (v16+)

MongoDB (локально или в облаке)

Git

Yarn (для управления зависимостями)

Установка и запуск

1. Клонирование репозитория

git clone https://github.com/dimashshs/QazProvide.git
cd QazProvide

2. Настройка backend

cd backend
cp .env.example .env  # Создайте файл конфигурации и укажите параметры

# Установка зависимостей
npm install

# Запуск сервера
npm run dev  # Запуск в режиме разработки
npm start    # Запуск в продакшене

3. Настройка frontend

cd ../frontend
cp .env.example .env  # Создайте файл конфигурации

# Установка зависимостей
yarn install

# Запуск клиента
yarn start

4. Запуск WebSocket-сервера

cd ../socket
npm install
npm start

API и документация

API документация доступна через Swagger:

Backend: http://localhost:5000/api-docs

Разработка и участие

Сделайте форк репозитория

Создайте новую ветку (git checkout -b feature-branch)

Внесите изменения и закоммитьте их (git commit -m "Описание изменений")

Отправьте изменения (git push origin feature-branch)

Откройте pull request

# Trigger deploy

Trigger CI/CD
