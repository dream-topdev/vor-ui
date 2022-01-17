FROM nginx:stable-alpine
COPY ./docker/assets/nginx.conf /etc/nginx/conf.d
CMD ["/bin/sh", "-c", "exec nginx -g 'daemon off;';"]
WORKDIR /etc/nginx
