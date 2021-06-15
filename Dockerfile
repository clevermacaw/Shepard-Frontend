FROM nginx:stable-alpine

EXPOSE 80

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /usr/share/nginx/
COPY dist /usr/share/nginx/html
RUN chmod +x /usr/share/nginx/entrypoint.sh

ENTRYPOINT ["/usr/share/nginx/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
