import app from './app.js';
import config from './config/index.js';

const { port, nodeEnv } = config.server;

const server = app.listen(port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎓 Jiji AI Learning Companion                           ║
║                                                           ║
║   Server running on port ${port.toString().padEnd(30)}║
║   Environment: ${nodeEnv.padEnd(39)}║
║                                                           ║
║   Endpoints:                                              ║
║   - POST /api/ask-jiji                                    ║
║   - GET  /api/resources                                   ║
║   - GET  /api/resources/:id                               ║
║   - GET  /api/queries/popular                             ║
║   - GET  /api/health                                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Forcing shutdown...');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default server;
