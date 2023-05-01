import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";

import { PersonProfession } from "../persons/personProfession";
import { Person } from "../persons/persons.model";


interface ProfessionCreationAtt {
  name:string;
}

@Table({tableName:'Profession', timestamps:false})
export class Profession extends Model<Profession,ProfessionCreationAtt> {

  @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
  id:number

  @Column({type:DataType.STRING, unique:true,})
  name:string

  @BelongsToMany(() => Person,() => PersonProfession)
  persons:Person[]

}