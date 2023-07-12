import { DataTypes } from 'sequelize';
import sequelize from '.';
import { Lotes } from './Lotes';

export const Boletos = sequelize.define("Boletos", {
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
  criadoEm: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

Boletos.belongsTo(Lotes, {
  foreignKey: "idLote",
  as: "lote",
});
