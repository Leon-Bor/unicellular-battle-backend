FROM node:16-alpine As Builder

WORKDIR /app 

COPY . . 

RUN npm install -g @nestjs/cli --production
RUN npm install --production
RUN npm run build 
RUN npm prune --production 

FROM node:16-alpine

WORKDIR /app 

COPY --from=Builder /app ./  

EXPOSE 3000
CMD ["node", "dist/main" ]