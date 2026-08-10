// const app = require('./app');
// const http = require('http');

// const server = http.createServer(app);

// server.listen(3005, () => {
//     console.log('Server is running on port 3005');
// });
const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1', '8.8.8.8']); // Cloudflare y Google DNS

require('dotenv').config();
const app = require('./app');
const PORT = 3005;

app.listen(PORT, () => {
    console.log(`Server listening in port: ${PORT}`);
});