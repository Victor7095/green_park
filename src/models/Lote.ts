import { DataTypes, Model, Optional } from "sequelize";
import sequelize from ".";
import Boleto from "./Boleto";

interface LoteAttributes {
  id: number;
  nome: string;
  ativo: boolean;
  criadoEm?: Date;
}
export interface LoteInput extends Optional<LoteAttributes, "id"> {}
export interface LoteOuput extends Required<LoteAttributes> {}

class Lote extends Model<LoteAttributes, LoteInput> implements LoteAttributes {
  public id!: number;
  public nome!: string;
  public ativo!: boolean;
  public readonly criadoEm!: Date;

  static associate() {
    Lote.hasMany(Boleto, {
      sourceKey: "id",
      foreignKey: "idLote",
      as: "boletos",
    });
  }
}

Lote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Lote",
    createdAt: "criadoEm",
    updatedAt: false,
  }
);

export default Lote;
