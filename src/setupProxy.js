const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5001',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' }, // Keep the /api prefix when forwarding
      timeout: 60000,  // Increase timeout to 60 seconds
      logLevel: 'debug', // Enable more detailed logging
      onProxyReq: (proxyReq, req, res) => {
        // Log outgoing request
        console.log(`Proxying request to: ${req.method} ${req.url}`);
        
        // Add original request info
        proxyReq.setHeader('X-Forwarded-For', req.connection.remoteAddress);
      },
      onProxyRes: (proxyRes, req, res) => {
        // Log response from target
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
}; 