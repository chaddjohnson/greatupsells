#!/bin/bash

# Update mongo.pem.
cat /etc/letsencrypt/live/domain_name/fullchain.pem /etc/letsencrypt/live/domain_name/privkey.pem > /etc/ssl/mongodb.pem
chmod 644 /etc/ssl/mongodb.pem

# Update ca.pem.
openssl x509 -in /etc/ssl/ca.crt -out /etc/ssl/ca.pem -outform PEM
cat /etc/letsencrypt/live/domain_name/chain.pem >> /etc/ssl/ca.pem

# Generate MongoDB key file if it does not exist.
if [ ! -f /etc/ssl/mongodb-keyfile.txt ]; then
  openssl rand -base64 768 > /etc/ssl/mongodb-keyfile.txt
fi

chown mongodb:mongodb /etc/ssl/mongodb-keyfile.txt
chmod 400 /etc/ssl/mongodb-keyfile.txt

# Machine must be rebooted when certificate is updated.
reboot
