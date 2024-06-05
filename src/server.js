const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  // Membuat HTTP Server dengan method Hapi.server()
  // Dengan satu parameter ServerOptions
  const server = Hapi.server({
    // Kriteria 1 aplikasi port 9000
    port: 9000,
    host: 'localhost',
    routes: { // Same-Origin Policy
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  // Proses menjalankan server secara asynchronous.
  await server.start();

  // melihat alamat lengkap dan port di mana server dijalankan
  // lewat server.info.uri
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
