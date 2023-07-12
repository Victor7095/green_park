import { DataTypes } from "sequelize";
import sequelize from ".";
import { Boletos } from "./Boletos";

export const Lotes = sequelize.define("Lotes", {
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
  criadoEm: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

Lotes.hasMany(Boletos, {
  sourceKey: "id",
  foreignKey: "idLote",
  as: "boletos",
});
