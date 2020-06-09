const fastify = require('fastify');
const fastifyAutoPush = require('fastify-auto-push');
const fs = require('fs');
const path = require('path');
const {
  promisify
} = require('util');

const fsReadFile = promisify(fs.readFile);

const SERVE_DIR = process.argv[2] || '.';
const STATIC_DIR = path.join(process.cwd(), SERVE_DIR);
const CERTS_DIR = 'E:/projects/personal/nginx-server/ssl';
const PORT = 8080;

const [key, cert] = [
  fs.readFileSync(path.join(CERTS_DIR, 'privkey.pem')),
  fs.readFileSync(path.join(CERTS_DIR, 'fullchain.pem')),
];

const app = fastify({
  https: {
    key,
    cert
  },
  http2: true,
  logger: true,
});

app.register(fastifyAutoPush.staticServe, {
  root: STATIC_DIR,
});

app.listen(PORT, (err, address) => {
  if (err) throw err;
  console.log(`Serving ${SERVE_DIR} on port ${PORT}`);
});
