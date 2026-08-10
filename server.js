const app = require('./app');
const http = require('http');

const server = http.createServer(app);

server.listen(3005, () => {
    console.log('Server is running on port 3005');
});

const PAGE_URL = process.env.NODE_ENV === "production" 
 ? "https://"
 : "http://localhost:3005";

const MONGO_URI = process.env.NODE_ENV === "production" 
 ? process.env.MONGO_URI_PROD
 : process.env.MONGO_URI_TEST;

module.exports = { PAGE_URL, MONGO_URI };