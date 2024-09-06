#!/bin/sh

openssl req -x509 -nodes -newkey rsa:2048 \
  -config ./openssl.cnf \
  -keyout privkey.pem \
  -out fullchain.pem \
  -days 3600 \
  -subj '/C=DE/ST=NRW/L=Nettetal/O=5v3n-08 KG/OU=sst /CN=my.app.dev/emailAddress=local@app.dev'
