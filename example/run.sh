ls
echo "========="
{ node ./warehouse-service/index.js & node ./notification-service/index.js & node ./trade-service/index.js; }
node ./trade-service/index.js
