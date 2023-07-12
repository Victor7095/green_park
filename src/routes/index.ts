import { ServerRoute } from "@hapi/hapi";
import receberBoleto from "../controllers/receberBoleto";

const routes: ServerRoute[] = [
  {
    method: "POST",
    path: "/receber-boleto",
    handler: receberBoleto,
    options: {
      payload: {
        parse: true,
        allow: "multipart/form-data",
        multipart: { output: "stream" },
      },
    },
  }
]

export default routes;