import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidationModule } from './users/validation/validation.module';
import { SessionModule } from './session/session.module';
import getDataSourceConfig from './data-source.config';

@Module({
  imports: [
    ValidationModule,
    UsersModule,
    TypeOrmModule.forRoot(getDataSourceConfig()),
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
