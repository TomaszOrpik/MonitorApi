import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionsModule } from './Modules/sessions.module';
import { UsersModule } from './Modules/users.module';

@Module({
  imports: [
    UsersModule,
    SessionsModule,
    MongooseModule.forRoot(
    'mongodb+srv://admin:Start123@cluster0-986vv.azure.mongodb.net/usersactivity?retryWrites=true&w=majority'
  )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
