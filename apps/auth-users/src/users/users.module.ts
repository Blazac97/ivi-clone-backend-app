import { Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {Role} from "../roles/roles.model";

import {RolesModule} from "../roles/roles.module";


import { JwtModule } from "@nestjs/jwt";
import { UserRoles } from '../roles/user-role';


@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles]),
    RolesModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '2h'
      }
    })
  ],
  exports: [
    UsersService,JwtModule,
  ]
})
export class UsersModule {}