const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/uploads',
        createProxyMiddleware({
            target: 'https://backend-vtwx.onrender.com',
            changeOrigin: true,
        })
    );
};
