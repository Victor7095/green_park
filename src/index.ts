import Hapi from "@hapi/hapi";
import * as db from "./models";
import routes from "./routes";

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  db.default
    .sync()
    .then(() => {
      console.log("Synced db.");
    })
    .catch((err) => {
      console.log("Failed to sync db: " + err.message);
    });

  server.route(routes);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
