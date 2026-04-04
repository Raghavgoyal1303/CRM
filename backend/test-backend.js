// test-backend.js
const http = require('http');

http.get('http://localhost:5000/api/super/stats', (resp) => {
  let data = '';
  resp.on('data', chunk => data += chunk);
  resp.on('end', () => console.log('Response:', data));
}).on('error', err => console.error('Error:', err.message));
