import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1667643332586 implements MigrationInterface {
  name = 'migrations1667643332586';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "avatar" varchar, "liveInCity" varchar NOT NULL DEFAULT ('Не указан'), "birthdayDate" varchar NOT NULL DEFAULT ('Не указан'), "education" varchar NOT NULL DEFAULT ('Не указано'), "directions" varchar NOT NULL DEFAULT ('Не указано'), "frameworks" varchar NOT NULL DEFAULT ('Не указаны'), "programmingLanguages" varchar NOT NULL DEFAULT ('Не указаны'), "expirience" varchar NOT NULL DEFAULT ('Не указан'), "databases" varchar NOT NULL DEFAULT ('Не указаны'), "gender" varchar NOT NULL DEFAULT ('Не указан'), "aboutMe" varchar NOT NULL DEFAULT ('Пусто'), "middleName" varchar NOT NULL DEFAULT (''), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
