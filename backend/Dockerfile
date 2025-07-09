FROM node:21-alpine as transform

# Set environment variables
ENV PORT=3008
ENV DB_CONNECTION=mysql
ENV DB_HOST=adoring_einstein
ENV DB_USERNAME=root
ENV DB_PORT=3306
ENV DB_DIALECT=mysql
ENV DB_PASSWORD="root@123"
ENV DB_DATABASE=visitorbook
ENV JWT_SECRET="qwertasdfgzxcvb!@#1234567890)(*&^%$#@!"

WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm install --save-dev sequelize-cli
COPY --chown=node:node . .
EXPOSE 3008

# Install pm2 globally
# RUN npm install -g pm2

# Run pm2 to start the application
CMD ["npm", "start"]
