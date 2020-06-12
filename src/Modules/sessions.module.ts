import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionsController } from '../Controllers/sessions.controller';
import { SessionsService } from '../Services/sessions.service';
import { SessionSchema } from '../Models/session.model';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }])],
    controllers: [SessionsController],
    providers: [SessionsService]
})

export class SessionsModule { }