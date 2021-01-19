# TGComment
This web-app and bot allow you to write comments to public Telegram posts in real-time And Supports these features:

1. Send Comments to posts
2. Like comments
3. Reply to comments 
4. Edit comments which has sent recently
5. Delete my comments

## How to configure?
1. Install Nodejs and mongoDB in your server by running this commands
2. If you are in Ubuntu 20, run these commands:
```
sudo apt update && sudo apt install curl -y
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install nodejs -y
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```
3. If you are in CentOS 8 or Redhat, run these  commands:
```
sudo yum -y install curl
curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
sudo yum install -y nodejs

sudo yum install -y mongodb
sudo systemctl start mongod
sudo systemctl enable mongod

```
4. Confirm if your Nodejs version is newer than 10.x.x by running this command:
```
node -v
```

5. Install required node modules 
```
npm install
```

6. Edit config.js file which is located in `inc` folder of the project
```
module.exports = {
    domain: 'https://YOURDOMAIN',
    projectDir: 'DIRECTORY_OF_THE_PROJECT',
    staticDir: 'DIRECTORY_OF_STATIC_FILES',
    staticDirUrl: 'SITE_STATIC_FILES_URL',
    token: "xxxxxxxxxx:YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
    username: 'YourNameBot',
    channel: '@PublicChannelUsername',
    adminToken: "xxxxxxxxxx:YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
    invitesCount: 0, // If you want to enable some features for users who invited another users to bot
    commentLimit: 30, // It is for pagination when loading new comments
    socketAdminPass: 'SOME_PASSWORD',
    managerChannel: -1001169323168 // Userid of channel which user and comment logs are going to send
};
```
7. (Optional) Install pm2 to manage processes easily:

```
sudo npm install -g pm2
```
8. Change the working directory to project directory
9. Create pm2 instances for required scripts:
```
pm2 start app.js --name CommentHttpServer
pm2 start manage.js --name CommentAdminManagerBot
pm2 start postCronjob.js --name CommentPostScheduler
pm2 start bot.js --name CommentUserEndBot
pm2 start socket.js --name CommentWebSocket
```

10. Install nginx to setup reverse proxy:
```
apt install -y nginx
yum install -y nginx
```

11. Create domain.conf file in /etc/nginx/sites-available
12. Copy these configurations to this file:
```
server {
        listen 80;
        server_name YOURDOMAIN;

        location / {
                return 301 https://$host$request_uri;
        }
}

server {
        listen 443 ssl;
        server_name YOURDOMAIN;

        ssl_certificate ABSOLUTE_PATH_TO_CERT;
        ssl_certificate_key ABSOLUTE_PATH_TO_CERT_PRIVATE_KEY;
        
        ssl_ciphers ALL:!aNULL:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
        ssl_protocols TLSv1.1 TLSv1.2;

        location /socket.io/ {
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_http_version 1.1;
                proxy_pass http://127.0.0.1:3051;
        }



        location / {
                proxy_pass http://127.0.0.1:3050;
                proxy_http_version 1.1;
                proxy_send_timeout 10s;
                proxy_hide_header "X-Powered-By";
        }

}
```

13. Go to `sites-enabled` directory and create symbolic link to `sites-available`
```
cd sites-available
ln -s ../sites-available/DOMAIN.conf .
```

14. Run `nginx -t` to check if you have configuration mistakes or not.
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```
15. Run `nginx -s reload` or `systemctl restart nginx` to sync Nginx with your new configurations
16. Enjoy!

## TODO 
- [ ] Refactor project.
- [ ] Use dot.env instead of config.js for better security.
- [ ] Support commenting on multiple channels simultaneously.
- [ ] Add support for live-chat in web application.
- [ ] Dockerize main parts of the project.
