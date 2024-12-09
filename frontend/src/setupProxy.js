const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:4040',
      changeOrigin: true,
      onProxyReq: (proxyReq) => {
        console.log('Proxying request to:', proxyReq.path);
      },
    })
  );

  app.use(
    '/test-proxy',
    createProxyMiddleware({
      target: 'http://localhost:4040',
      changeOrigin: true,
    })
  );
};
