import {BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

import { Profession } from "../professions/professions.model";
import { Person } from "./persons.model";

@Table({tableName:'_PersonToProfession',createdAt: false, updatedAt: false})
export class PersonProfession extends Model<PersonProfession> {

  @ForeignKey(() => Person)
  @Column({type:DataType.INTEGER})
  A:number

  @ForeignKey(() => Profession)
  @Column({type:DataType.INTEGER})
  B:number



}