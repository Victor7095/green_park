import { Request, ResponseToolkit } from "@hapi/hapi";
import { Op, WhereOptions } from "sequelize";
import { PDFDocument, rgb } from "pdf-lib";
import Boleto, { BoletoAttributes } from "../models/Boleto";

interface Query {
  nome: string;
  valor_inicial: number;
  valor_final: number;
  id_lote: number;
  relatorio: string;
}

const createPDF = async (boletos: Boleto[]) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([700, 400]);
  page.moveTo(30, 350);
  page.drawText("Relatório de Boletos", {
    size: 20,
  });

  // Draw table header
  page.moveTo(30, 330);
  page.drawText("ID", {
    size: 10,
  });
  page.moveTo(60, 330);
  page.drawText("Nome", {
    size: 10,
  });
  page.moveTo(170, 330);
  page.drawText("Lote", {
    size: 10,
  });
  page.moveTo(250, 330);
  page.drawText("Valor", {
    size: 10,
  });
  page.moveTo(350, 330);
  page.drawText("Linha Digitável", {
    size: 10,
  });
  page.moveTo(500, 330);
  page.drawText("Ativo", {
    size: 10,
  });
  page.moveTo(550, 330);
  page.drawText("Criado em", {
    size: 10,
  });

  // Draw table lines
  page.moveTo(30, 320);
  page.drawLine({
    start: { x: 30, y: 320 },
    end: { x: 650, y: 320 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  boletos.forEach((boleto, i) => {
    const y = 307 - i * 15;

    // ID
    page.moveTo(30, y);
    page.drawText(boleto.id.toString(), {
      size: 10,
    });

    // Nome
    page.moveTo(60, y);
    page.drawText(boleto.nomeSacado, {
      size: 10,
    });

    // Lote
    page.moveTo(170, y);
    page.drawText(boleto.idLote.toString(), {
      size: 10,
    });

    // Valor
    page.moveTo(250, y);
    const valor = boleto.valor.toFixed(2);
    page.drawText(`R$ ${valor}`, {
      size: 10,
    });

    // Linha Digitável
    page.moveTo(350, y);
    page.drawText(boleto.linhaDigitavel, {
      size: 10,
    });

    // Ativo
    page.moveTo(500, y);
    const ativo = boleto.ativo ? "Sim" : "Não";
    page.drawText(ativo, {
      size: 10,
    });

    // Criado em
    page.moveTo(550, y);
    page.drawText(boleto.criadoEm.toDateString(), {
      size: 10,
    });

    // Draw table lines
    page.moveTo(30, y);
    page.drawLine({
      start: { x: 30, y: y - 2},
      end: { x: 650, y: y - 2},
      thickness: 1,
      color: rgb(0, 0, 0),
    });
  });
  const pdfBytes = await pdfDoc.save();
  const pdfBuffer = Buffer.from(pdfBytes.buffer);
  return pdfBuffer;
};

const handler = async (request: Request, h: ResponseToolkit) => {
  const query = request.query as Query;
  const where: WhereOptions<BoletoAttributes> = {};
  if (query.nome) {
    where.$nomeSacado$ = {
      [Op.like]: `%${query.nome}%`,
    };
  }
  let valor = null;
  if (query.valor_inicial) {
    valor = {
      [Op.gte]: query.valor_inicial,
    };
  }
  if (query.valor_final) {
    valor = {
      ...valor,
      [Op.lte]: query.valor_final,
    };
  }
  if (valor) {
    where.$valor$ = valor;
  }
  if (query.id_lote) {
    where.$idLote$ = query.id_lote;
  }
  const boletos = await Boleto.findAll({
    where: where,
  });
  if (query.relatorio === "1") {
    console.log("Relatório 1");
    const pdfDataUri = await createPDF(boletos);
    return h.response(pdfDataUri).type("application/pdf");
  }
  return JSON.stringify(boletos);
};

export default handler;
