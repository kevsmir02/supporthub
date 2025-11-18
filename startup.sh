#!/bin/bash

# Copy nginx config to point to public directory
cp /home/site/wwwroot/nginx-default /etc/nginx/sites-available/default

# Restart nginx
service nginx reload
