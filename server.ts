// import { createServer } from 'node:http';

// createServer(function (request, response) {
//     if (request.url !== '/api/health') {
//         send(response, 404, {message: 'Recurso não encontrado'});
//         return;
//     }

//     send(response, 200, {status: 'ok'});
// }).listen(3000);
// passou disso de cima para o que esta em baixo. com o express

import express from "express";
import invoices from "./invoice.route.ts";

const app = express();

app.use(function (request, response, next) {
  console.log(request.method + " " + request.url);
  next();
});

app.get("/api/health", function (request, response) {
  // send(response, 200, { status: 'ok' }); foi feito agora pelo express
  // a parte de baixo
  response.status(200).json({ status: "ok" });
});

app.use("/api/invoices", invoices);

app.use(function (request, response) {
  response.status(404).json({ message: "Recurso não encontrado" });
});

app.listen(3000);
