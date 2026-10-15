// Local dev load balancer: round-robins between two API instances.
// Run two API servers on :4000 and :4001, then:
//   node tools/dev/load-balancer.js
// Kept out of the apps/ tree because it is dev tooling, not shipped code.
const http = require('http');

const targets = ['http://localhost:4000', 'http://localhost:4001'];
let i = 0;

const server = http.createServer((req, res) => {
    const target = targets[i % targets.length];
    i++;
    const url = new URL(req.url, target);

    const proxyReq = http.request(
        url,
        { method: req.method, headers: { ...req.headers, host: url.host } },
        proxyRes => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        }
    );

    proxyReq.on('error', err => {
        res.writeHead(502);
        res.end('Bad gateway: ' + err.message);
    });

    req.pipe(proxyReq);
});

server.listen(8080, () => console.log('LB listening on http://localhost:8080 → 4000, 4001'));