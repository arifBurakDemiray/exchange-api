#!/usr/bin/env bash

if ! grep -q letsencrypt </etc/nginx/nginx.conf; then
  sudo certbot -n -d super-trader.eu-central-1.elasticbeanstalk.com --nginx --agree-tos --email burakdemiray09@hotmail.com
fi
