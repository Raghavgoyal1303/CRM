FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps --no-audit
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
