import { MailerOptions } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

export default (): MailerOptions => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return {
        transport: process.env.TRANSPORT_MAILER_URL ?? 'smtp://localhost:1025',
        defaults: {
          from: '"Blacking" <blacking@new.com>',
        },
        template: {
          dir: `${process.cwd()}/backend/src/users/templates`,
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      };
    default:
      return {
        transport: 'smtp://localhost:1025',
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: `${process.cwd()}/backend/src/users/templates`,
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
        preview: true,
      };
  }
};
