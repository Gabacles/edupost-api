FROM node:20-alpine

WORKDIR /usr/app

COPY package.json ./  

RUN npm install  

COPY . .  

ARG DATABASE_URL  
ARG JWT_SECRET  

ENV DATABASE_URL=$DATABASE_URL  
ENV JWT_SECRET=$JWT_SECRET  

RUN echo "DATABASE_URL=${DATABASE_URL}" > .env  
RUN echo "JWT_SECRET=${JWT_SECRET}" >> .env  

RUN npm i -g pnpm  

RUN pnpm build  

EXPOSE 3000 

CMD ["node", "dist/main"]
