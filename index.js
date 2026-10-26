// Root entry forwarder to app.js
const { app, startServer } = require('./app.js');

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
