import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ValidationModule } from './users/validation/validation.module';
import { SessionModule } from './session/session.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import getMailerConfig from './common/config/mailer.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsersProfileModule } from './users-profile/users-profile.module';
import getDataSourceConfig from './common/config/datasource.config';
import { ColleagueshipModule } from './colleagueships/colleagueships.module';

@Module({
  imports: [
    ValidationModule,
    UsersModule,
    UsersProfileModule,
    SessionModule,
    ColleagueshipModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({}),
      dataSourceFactory: async () => getDataSourceConfig(),
    }),
    MailerModule.forRoot(getMailerConfig()),
  ],
})
export class AppModule {}
