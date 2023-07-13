import { ServerRoute } from "@hapi/hapi";
import receberBoletoCSV from "../controllers/receberBoletoCSV";
import receberBoletoPDF from "../controllers/receberBoletoPDF";

const routes: ServerRoute[] = [
  {
    method: "POST",
    path: "/receber-boleto-csv",
    handler: receberBoletoCSV,
    options: {
      payload: {
        parse: true,
        allow: "multipart/form-data",
        multipart: { output: "stream" },
      },
    },
  },
  {
    method: "POST",
    path: "/receber-boleto-pdf",
    handler: receberBoletoPDF,
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