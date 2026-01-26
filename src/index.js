const http = require('http');
const { router } = require('./router');

const PORT = process.env.PORT || 3000;

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

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { server };
