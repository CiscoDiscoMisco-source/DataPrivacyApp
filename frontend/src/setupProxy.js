const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Determine the API URL based on environment
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  
  app.use(
    '/api',
    createProxyMiddleware({
      target: apiUrl,
      changeOrigin: true,
      timeout: 60000,  // Increase timeout to 60 seconds
      logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
      onProxyReq: (proxyReq, req, res) => {
        // Log outgoing request in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`Proxying request to: ${req.method} ${req.url}`);
        }
        
        // Add original request info
        proxyReq.setHeader('X-Forwarded-For', req.connection.remoteAddress);
      },
      onProxyRes: (proxyRes, req, res) => {
        // Log response from target in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`Response from backend: ${proxyRes.statusCode} for ${req.url}`);
        }
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