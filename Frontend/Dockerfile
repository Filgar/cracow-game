FROM node:20.10.0-alpine3.19 as build

WORKDIR /app

COPY package*.json ./

RUN npm install -g @angular/cli@17.0.8
RUN npm install

COPY . .

RUN npm run build

EXPOSE 4200

CMD ["ng", "serve", "--host=0.0.0.0"]