const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/uploads',
        createProxyMiddleware({
            target: 'https://backend-lt9m.onrender.com',
            changeOrigin: true,
        })
    );
};
