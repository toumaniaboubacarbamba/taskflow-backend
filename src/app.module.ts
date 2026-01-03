import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Charge les variables d'environnement depuis .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Connexion MongoDB
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow',
    ),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
