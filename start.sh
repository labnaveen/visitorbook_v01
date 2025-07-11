sudo -u visitorbook bash -C '
cd /var/lib/jenkins/workspace/Git-checkout/backend/

npm i

npm run start:pm2
'
