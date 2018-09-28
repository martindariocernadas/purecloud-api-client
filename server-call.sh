#example for launching the nginx http-server component with certificates, listening on specific port
http-server . -c 0 -S -C ./certs/server-crt.pem -K ./certs/server-key.pem -p 8444
