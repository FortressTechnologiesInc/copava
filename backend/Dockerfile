FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

COPY src ./src
COPY ../frontend/public ./frontend/public

ENV NODE_ENV=production
ENV UPLOAD_DIR=/uploads

RUN mkdir -p /uploads

EXPOSE 8080

CMD ["npm", "start"]
