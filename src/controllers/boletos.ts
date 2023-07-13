import { Request } from "@hapi/hapi";
import { Op, WhereOptions } from "sequelize";
import Boleto, { BoletoAttributes } from "../models/Boleto";

interface Query {
  nome: string;
  valor_inicial: number;
  valor_final: number;
  id_lote: number;
}

const handler = async (request: Request) => {
  const query = request.query as Query;
  console.log(query, query.nome);
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
  return JSON.stringify(boletos);
};

export default handler;
