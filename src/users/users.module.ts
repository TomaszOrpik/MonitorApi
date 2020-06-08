import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from '../session/session.model';
import { SessionsService } from '../session/sessions.service';


@Module({
    imports: [MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }])],
    controllers: [UsersController],
    providers: [UsersService, SessionsService]
})

export class UsersModule { }