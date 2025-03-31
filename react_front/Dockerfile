FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 19000
EXPOSE 19001

CMD ["npm", "start"]
