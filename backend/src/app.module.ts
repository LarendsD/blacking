import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ValidationModule } from './users/validation/validation.module';
import { SessionModule } from './session/session.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import getDatabaseConfig from './common/config/database.config';

@Module({
  imports: [
    ValidationModule,
    UsersModule,
    SessionModule,
    TypeOrmModule.forRoot(getDatabaseConfig()),
  ],
})
export class AppModule {}
