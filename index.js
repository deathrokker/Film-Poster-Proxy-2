const http = require('http');

const server = http.createServer((req, res) => {
  // Enable CORS for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');

  const url = new URL(req.url, `http://${req.headers.host}`);
  const target = url.searchParams.get('url');

  if (!target) {
    res.writeHead(400);
    res.end('Missing url parameter');
    return;
  }

  const protocol = target.startsWith('https') ? require('https') : require('http');
  protocol.get(target, (response) => {
    res.writeHead(response.statusCode, {
      'Content-Type': response.headers['content-type']
    });
    response.pipe(res);
  }).on('error', (err) => {
    console.error(err);
    res.writeHead(500);
    res.end('Proxy error');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Proxy running on port ${port}`));
