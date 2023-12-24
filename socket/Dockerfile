FROM node:lts-slim

WORKDIR /app
COPY package.json .
RUN npm install

COPY . .

EXPOSE 9000
CMD ["npm", "start"]

#docker run --restart=always -itd -p 9000:9000 nabilnewaz/ims-socket-backend