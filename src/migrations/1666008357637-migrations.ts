import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1666008357637 implements MigrationInterface {
  name = 'migrations1666008357637';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "avatar" varchar NOT NULL DEFAULT (''), "liveInCity" varchar NOT NULL DEFAULT (''), "birtdayDate" varchar NOT NULL DEFAULT (''), "gender" varchar NOT NULL DEFAULT (''), "aboutMe" varchar NOT NULL DEFAULT (''), "middleName" varchar NOT NULL DEFAULT (''), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
