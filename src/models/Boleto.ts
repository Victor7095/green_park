import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '.';
import Lote from './Lote';


interface BoletoAttributes {
  id: number;
  nomeSacado: string;
  idLote: number;
  valor: number;
  linhaDigitavel: string;
  ativo?: boolean;
  criadoEm?: Date;
}
export interface BoletoInput extends Optional<BoletoAttributes, 'id'> {}
export interface BoletoOuput extends Required<BoletoAttributes> {}

class Boleto extends Model<BoletoAttributes, BoletoInput> implements BoletoAttributes {
  public id!: number
  public nomeSacado!: string
  public idLote!: number
  public valor!: number
  public linhaDigitavel!: string
  public ativo!: boolean
  public readonly criadoEm!: Date;

  static associate() {
    Boleto.belongsTo(Lote, {
      foreignKey: "idLote",
      as: "lote",
    });
  }
}

Boleto.init( {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nomeSacado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idLote: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  valor: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  linhaDigitavel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Boleto',
  createdAt: "criadoEm",
  updatedAt: false,
});

export default Boleto;
