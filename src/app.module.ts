import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AnimalController } from './animal/animal.controller';
import { AnimalModule } from './animal/animal.module';
import { UserService } from './user/user.service';
import { PostgresqlConfigModule } from './config/database/config.module';
import { TypeOrmConfiguration } from './config/database/type-orm-configuration';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(TypeOrmConfiguration.config),
    UserModule,
    AnimalModule,
    PostgresqlConfigModule,
  ],
  controllers: [AppController, AnimalController],
  providers: [AppService, UserService],
})
export class AppModule {}
