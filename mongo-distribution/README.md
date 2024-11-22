first of all install node_modules :

cd mongo-distribution
npm install

create data directory in this location :
C:\data
    |--db1
    |--db2
    |--db3
    |--db4

to run databases using docker :
docker-compose up --build

to stop docker containers :
docker-compose down

to run without docker :
mongod --port 27017 --dbpath C:\data\db1 --logpath C:\data\db1\mongo.log
mongod --port 27018 --dbpath C:\data\db2 --logpath C:\data\db2\mongo.log
mongod --port 27019 --dbpath C:\data\db3 --logpath C:\data\db3\mongo.log
mongod --port 27020 --dbpath C:\data\db4 --logpath C:\data\db4\mongo.log

to insert data :
node InsertData.js
