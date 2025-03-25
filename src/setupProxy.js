const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Only proxy in development environment
  if (process.env.NODE_ENV === 'development') {
    app.use(
      '/api',
      createProxyMiddleware({
        // In development, proxy to local API
        target: 'http://localhost:5001',
        changeOrigin: true,
        timeout: 60000,
        logLevel: 'debug',
        onProxyReq: (proxyReq, req, res) => {
          console.log(`Proxying request to: ${req.method} ${req.url}`);
          proxyReq.setHeader('X-Forwarded-For', req.connection.remoteAddress);
        },
        onProxyRes: (proxyRes, req, res) => {
          console.log(`Response from backend: ${proxyRes.statusCode} for ${req.url}`);
        },
        onError: (err, req, res) => {
          console.error('Proxy error:', err);
          res.writeHead(504, {
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify({ 
            message: 'The backend server is not responding. Please try again later.',
            error: err.message
          }));
        }
      })
    );
  }
  // In production on Vercel, the API requests will be handled by serverless functions
}; 