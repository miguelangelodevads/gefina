import { createServer } from "node:http";
import send from "./send.ts";

createServer(function (request, response) {
  if (request.url === "/health") {
    send(response, 404, { message: "Recurso não encontrado" });
    return;
  }
  send(response, 200, { message: "ok" });
}).listen(3000);
