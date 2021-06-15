#!/bin/sh

JSON_STRING='window.configs = { \
  "VUE_APP_BACKEND":"'"${VUE_APP_BACKEND}"'", \
  "VUE_APP_OIDC_AUTHORITY":"'"${VUE_APP_OIDC_AUTHORITY}"'", \
  "VUE_APP_CLIENT_ID":"'"${VUE_APP_CLIENT_ID}"'" \
}'

sed -i "s@// CONFIGURATIONS_PLACEHOLDER@${JSON_STRING}@" /usr/share/nginx/html/config.js

exec "$@"
