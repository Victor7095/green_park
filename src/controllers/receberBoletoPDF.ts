import { Request } from "@hapi/hapi";
import { Readable } from "stream";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
import { TextItem } from "pdfjs-dist/types/src/display/api";
import Boleto from "../models/Boleto";
import { Op } from "sequelize";
import { PDFDocument } from "pdf-lib";
import fs from "fs";

const getContentFromPDF = async (file: Uint8Array) => {
  const loadingTask = pdfjsLib.getDocument(file);
  const doc = await loadingTask.promise;
  const numPages = doc.numPages;

  const loadPage = async function (pageNum: number) {
    const page = await doc.getPage(pageNum);
    console.log("# Page " + pageNum);
    const viewport = page.getViewport({ scale: 1 });
    console.log("Size: " + viewport.width + "x" + viewport.height);
    console.log();
    const content = await page.getTextContent();
    // Content contains lots of information about the text layout and
    // styles, but we need only strings at the moment
    const strings = content.items.map(function (item) {
      const textItem = item as TextItem;
      return textItem.str;
    });
    console.log("## Text Content");
    console.log(strings.join(" "));
    // Release page resources.
    page.cleanup();
    return strings;
  };

  const pagesContent = [];
  for (let i = 1; i <= numPages; i++) {
    const pageContent = await loadPage(i);
    pagesContent.push(pageContent);
  }
  return pagesContent;
};

const getBoletoIdsFromPDF = async (pagesContent: string[][]) => {
  const ids: number[] = [];
  for await (const pageContent of pagesContent) {
    const nome = pageContent[0];
    const boleto = await Boleto.findOne({
      where: {
        nomeSacado: {
          [Op.like]: `${nome}%`,
        },
      },
    });
    console.log(nome, boleto?.nomeSacado);
    if (boleto) {
      ids.push(boleto.id);
    }
  }
  return ids;
};

const splitAndSavePages = async (file: Uint8Array, ids: number[]) => {
  const srcDoc = await PDFDocument.load(file);

  ids.forEach(async (id, i) => {
    const pdfDoc = await PDFDocument.create();
    const copiedPage = await pdfDoc.copyPages(srcDoc, [i]);

    pdfDoc.addPage(copiedPage[0]);
    const pdfBytes = await pdfDoc.save();
    const fileName = `./uploads/${id}.pdf`;
    fs.appendFile(fileName, Buffer.from(pdfBytes), function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log(`Saved ${fileName}`);
      }
    });
  });
};

const handler = async (request: Request) => {
  const data = request.payload as { file: Readable };
  const file = new Uint8Array(data.file.read());

  const pagesContent = await getContentFromPDF(file);
  const ids = await getBoletoIdsFromPDF(pagesContent);

  await splitAndSavePages(file, ids);
  return "OK";
};

export default handler;
