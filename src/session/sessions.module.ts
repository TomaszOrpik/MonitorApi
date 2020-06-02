import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { SessionSchema } from './session.model';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }])],
    controllers: [SessionsController],
    providers: [SessionsService]
})

export class SessionsModule { }