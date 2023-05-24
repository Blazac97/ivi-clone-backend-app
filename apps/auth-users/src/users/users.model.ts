import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Role } from "../roles/roles.model";
import { UserRoles } from "../roles/user-role";
import {ApiProperty} from "@nestjs/swagger";

interface UserCreationAtt {
  email: string;
  password: string;
}

@Table({tableName:'users'})
export class User extends Model<User,UserCreationAtt> {

  @ApiProperty({example:'1', description:'Уникальный идентификатор'})
  @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
  id:number

  @ApiProperty({example:'email@mail.com', description:'почта'})
  @Column({type:DataType.STRING, unique:true, allowNull:false})
  email:string

  @ApiProperty({example:'12345', description:'пароль'})
  @Column({type:DataType.STRING, allowNull:false})
  password:string

  @BelongsToMany(() => Role,() => UserRoles)
  roles:Role[]

}