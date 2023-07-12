import { Request, ResponseToolkit } from "@hapi/hapi";
import { Readable } from "stream";
import { finished } from "stream/promises";
import { parse } from "csv-parse";
import { BoletoCSV } from "../types";
import Boleto from "../models/Boleto";
import Lote from "../models/Lote";
import { Op } from "sequelize";

const uploadHandler = async (request: Request, h: ResponseToolkit) => {
  const data = request.payload as { file: Readable };
  const file = data.file;
  const parseCsv = file.pipe(
    parse({
      delimiter: ";",
      columns: true,
    })
  );

  const boletosCSV: BoletoCSV[] = [];

  parseCsv.on("data", (row) => {
    boletosCSV.push(row);
  });

  // Wait for the stream to process, or throw on an error
  await finished(parseCsv);

  // Get all record unidades
  const unidades = boletosCSV.map((boletoCSV) => boletoCSV.unidade.padStart(4, "0"));
  const lotes = await Lote.findAll({
    where: {
      nome: {
        [Op.in]: unidades,
      },
    },
  });
  for (const boletoCSV of boletosCSV) {
    const idLote = lotes.find(
      (lote) => lote.nome.replace(/^0+/, "") === boletoCSV.unidade
    )?.id;
    if (!idLote) {
      return h.response({ message: "Lote não encontrado" }).code(400);
    }
    Boleto.create({
      idLote,
      linhaDigitavel: boletoCSV.linha_digitavel,
      nomeSacado: boletoCSV.nome,
      ativo: true,
      valor: boletoCSV.valor,
    });
  }
  const boletos = await Boleto.findAll();
  return JSON.stringify(boletos);
};

export default uploadHandler;
