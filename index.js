const fastify = require('fastify');
const fastifyAutoPush = require('fastify-auto-push');
const fs = require('fs');
const path = require('path');

const STATIC_DIR = process.argv[2] || process.cwd();
const CERTS_DIR = 'E:/projects/personal/nginx-server/ssl';
const PORT = 8124;

const [key, cert] = [
  fs.readFileSync(path.join(CERTS_DIR, 'privkey.pem')),
  fs.readFileSync(path.join(CERTS_DIR, 'fullchain.pem')),
];

const app = fastify({
  https: {
    key,
    cert,
  },
  http2: true,
  logger: false,
  serverFactory: require('fastify-http2https')(),
});

app.register(fastifyAutoPush.staticServe, {
  root: path.resolve(STATIC_DIR),
});

app.listen(PORT, (err, address) => {
  if (err) throw err;
  console.log(`Serving ${STATIC_DIR} on port ${PORT}`);
});
