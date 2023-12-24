FROM node as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if using npm)
# COPY package*.json ./

# Install dependencies
# RUN npm install

# Copy the rest of the app's code
COPY . .

# Build the app
# RUN npm run build

# Use another lightweight image as the base for serving the app
FROM nginx:stable-alpine

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

## Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/*

## Add React nginx config file
COPY --from=build /app/default.conf /etc/nginx/conf.d

# Copy the built app from the previous stage to Nginx's default public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

#npm run build
#docker run --restart=always -itd -p 3000:80 nabilnewaz/ims-frontend
#Animated1Frontend