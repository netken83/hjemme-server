import express from "express"
import * as logger from "./logger";
import { ApolloServer, gql } from "apollo-server-express";
import config from "./config";
import Image from "./types/image";
import types from "./graphql/types"
import resolvers from "./graphql/resolvers"
import Scene from "./types/scene";
import * as path from "path";
import { libraryPath } from "./types/utility";
import debugHandler from "./debug";
import cookieParser from "cookie-parser";
import { checkPassword, passwordHandler } from "./password";

export default () => {
  const app = express();
  app.use(cookieParser());

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}: ${new Date().toLocaleString()}`);
    next();
  })

  app.get("/pass", checkPassword);

  app.use(passwordHandler);

  app.get("/debug", debugHandler);
  app.use('/js', express.static('./app/dist/js'));
  app.use('/css', express.static('./app/dist/css'));
  app.get("/", (req, res) => {
    const file = path.join(process.cwd(), "app/dist/index.html");
    res.sendFile(file);
  })

  app.use("/scene/:scene", (req, res, next) => {
    const scene = Scene.getById(req.params.scene);

    // TODO: Add to watches array

    if (scene && scene.path)
      res.sendFile(libraryPath(scene.path));
    else
      next(404);
  })

  app.use("/image/:image", (req, res, next) => {
    const image = Image.getById(req.params.image);

    if (image && image.path)
      console.log(libraryPath(image.path));

    if (image && image.path)
      res.sendFile(libraryPath(image.path));
    else
      next(404);
  })

  const server = new ApolloServer({ typeDefs: gql(types), resolvers });
  server.applyMiddleware({ app, path: "/ql" });

  app.use((err: number, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (typeof err == "number")
      return res.sendStatus(err);
    return res.sendStatus(500);
  });

  app.listen(3000, () => {
    logger.SUCCESS("Server running on Port 3000");
    console.log("Config:\n", config);
  })
}