# Frontend Dockerfile (Vite + React)
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install && npm cache clean --force

COPY . .

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
