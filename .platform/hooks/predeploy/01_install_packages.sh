#!/usr/bin/env bash

if ! command -v "certbot" &>/dev/null; then
  echo "installing certbot..."
  sudo yum install -y certbot python2-certbot-nginx
fi