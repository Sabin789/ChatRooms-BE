import express from "express";
import { createServer } from "http";
import cors, { CorsOptions } from "cors";
import passport from "passport";
import createHttpError from "http-errors";
import { BadRequestHandler, ForbiddenHandler, GenericErrorHandler, NotFoundHandler, UnAuthorizedHandler } from "./errorHandlers";
import UsersRouter from "./Api/Users";
import listEndpoints from "express-list-endpoints"
import ChatRouter from "./Api/ChatRooms";
import { Server } from "socket.io";
import { newConnectionHandler } from "./socket";
const expressServer = express();
const httpServer = createServer(expressServer);
const socketioServer = new Server(httpServer);



const whiteList = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOptions:CorsOptions = {
  origin: (currentOrigin, corsNext) => {
    if (!currentOrigin || whiteList.includes(currentOrigin)) {
      corsNext(null, true);
    } else {
      corsNext(createHttpError(400, "This origin is not allowed! ", currentOrigin));
    }
  },
};


socketioServer.on("connect", newConnectionHandler)


expressServer.use(cors(corsOptions));
expressServer.use(express.json());

// Mount UsersRouter on the appropriate path
expressServer.use("/users", UsersRouter);
expressServer.use("/chat",ChatRouter)

expressServer.use(BadRequestHandler);
expressServer.use(UnAuthorizedHandler);
expressServer.use(ForbiddenHandler);
expressServer.use(NotFoundHandler);
expressServer.use(GenericErrorHandler);

export { httpServer, expressServer };