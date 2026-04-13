const http = require('http');
const os = require('os');
const { router } = require('./router');

const PORT = process.env.BACKEND_PORT || process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    const result = await router(req);
    res.statusCode = result.status || 200;
    res.end(JSON.stringify(result.body));
  } catch (error) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.error(error.stack);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  const networkIP = Object.values(os.networkInterfaces())
    .flat()
    .find((i) => i && i.family === 'IPv4' && !i.internal)?.address;
  console.log(`Server running on http://localhost:${PORT}`);
  if (networkIP) console.log(`  ➜  Network: http://${networkIP}:${PORT}`);
});

module.exports = { server };
