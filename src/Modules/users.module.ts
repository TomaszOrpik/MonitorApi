import { Module } from '@nestjs/common';
import { UsersController } from '../Controllers/users.controller';
import { UsersService } from '../Services/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from '../Models/session.model';
import { SessionsService } from '../Services/sessions.service';


@Module({
    imports: [MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }])],
    controllers: [UsersController],
    providers: [UsersService, SessionsService]
})

export class UsersModule { }