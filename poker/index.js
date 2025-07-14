const http = require('http');
const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

const server = http.createServer((req, res) => {
  const reqPath = decodeURIComponent(req.url);
  const fullPath = path.join(baseDir, reqPath);

  fs.stat(fullPath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    if (stats.isDirectory()) {
      fs.readdir(fullPath, (err, files) => {
        if (err) {
          res.writeHead(500);
          return res.end('Error reading directory');
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Directory Listing of ${reqPath}</title>
  <style>
    body { font-family: sans-serif; padding: 2em; background: #f4f4f4; }
    h1 { font-size: 24px; }
    ul { list-style: none; padding: 0; }
    li { margin: 8px 0; }
    a { text-decoration: none; color: #0077cc; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Index of ${reqPath}</h1>
  <ul>
    ${files.map(file => {
      const href = path.join(reqPath, file).replace(/\\/g, '/');
      return `<li><a href="${href}">${file}</a></li>`;
    }).join('\n')}
  </ul>
</body>
</html>
        `);
      });
    } else {
      const stream = fs.createReadStream(fullPath);
      stream.on('error', () => {
        res.writeHead(500);
        res.end('Error reading file');
      });
      stream.pipe(res);
    }
  });
});

server.listen(8080, () => {
  console.log('Server running at http://localhost:8080/');
});
