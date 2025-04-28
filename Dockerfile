# Use Nginx to serve static files
FROM nginx:alpine

# Copy website files to nginx's default public folder
COPY . /usr/share/nginx/html

# Remove default nginx index page (optional)
RUN rm /usr/share/nginx/html/index.nginx-debian.html || true

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
