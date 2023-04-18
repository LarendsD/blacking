import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1681808084618 implements MigrationInterface {
  name = 'migrations1681808084618';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_profiles" ("id" SERIAL NOT NULL, "first_name" character varying(30), "last_name" character varying(30), "middle_name" character varying(30), "gender" "public"."user_profiles_gender_enum", "avatar" text, "birthday" date, "country_city" character varying(50), "about" text, "education" "public"."user_profiles_education_enum", "education_type" "public"."user_profiles_education_type_enum", "it_direction" "public"."user_profiles_it_direction_enum", "it_langs" "public"."user_profiles_it_langs_enum" array, "it_frameworks" "public"."user_profiles_it_frameworks_enum" array, "it_databases" "public"."user_profiles_it_databases_enum" array, "it_other_instruments" character varying array, CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "colleagueships" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "colleague_id" integer NOT NULL, "status" "public"."colleagueships_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "PK_dc95c397a37c373379efb2e7480" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "messages" ("text_content" text, "image_content" text array, "video_content" text array, "music_content" text array, "other_content" text array, "id" SERIAL NOT NULL, "sender_id" integer NOT NULL, "addressee_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "addresee_id" integer, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts" ("text_content" text, "image_content" text array, "video_content" text array, "music_content" text array, "other_content" text array, "id" SERIAL NOT NULL, "author_id" integer NOT NULL, "community_id" integer, "reposted_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "communities" ("text_content" text, "image_content" text array, "video_content" text array, "music_content" text array, "other_content" text array, "id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "community_type" "public"."communities_community_type_enum" array, "avatar" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fea1fe83c86ccde9d0a089e7ea2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "community_members" ("id" SERIAL NOT NULL, "member_id" integer NOT NULL, "community_id" integer NOT NULL, "member_role" "public"."community_members_member_role_enum" NOT NULL DEFAULT 'VIEWER', "joined_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_03dff82f9cfcb02498e9f5fc640" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying(80) NOT NULL, "password" character varying NOT NULL, "recover_hash" character varying, "user_profile_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_111d467fb4b0704ae501fec1c3" UNIQUE ("user_profile_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comments" ("text_content" text, "image_content" text array, "video_content" text array, "music_content" text array, "other_content" text array, "id" SERIAL NOT NULL, "author_id" integer NOT NULL, "post_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts_reactions" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "reaction_type" "public"."posts_reactions_reaction_type_enum", "post_id" integer NOT NULL, CONSTRAINT "PK_b800aa91ab92daa32b8ee2c0d4c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comments_reactions" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "reaction_type" "public"."comments_reactions_reaction_type_enum", "comment_id" integer NOT NULL, CONSTRAINT "PK_5deb35541bbdf2438a6bcd8faab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "colleagueships" ADD CONSTRAINT "FK_e3f335485ce0c0f427b71311f05" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "colleagueships" ADD CONSTRAINT "FK_113cc106c8dac85624b9373f454" FOREIGN KEY ("colleague_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_6435318a5112f571b038c1084df" FOREIGN KEY ("addresee_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_312c63be865c81b922e39c2475e" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_63078ada3266846e539d930b1be" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_b52dd2ad41a295a40e6714fe2cb" FOREIGN KEY ("reposted_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_members" ADD CONSTRAINT "FK_9cee09a19a82ecaf3b037f6e127" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_members" ADD CONSTRAINT "FK_46eb2c3e2d8b84acbd9a78974ab" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_111d467fb4b0704ae501fec1c36" FOREIGN KEY ("user_profile_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_e6d38899c31997c45d128a8973b" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts_reactions" ADD CONSTRAINT "FK_eda6a30b689770336fff10ee39d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts_reactions" ADD CONSTRAINT "FK_6cd2357793da928bfcf5f053336" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments_reactions" ADD CONSTRAINT "FK_e63034c5ccf748507ff24c87f50" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments_reactions" ADD CONSTRAINT "FK_e20c18f7a2f52d43e61d4e45262" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comments_reactions" DROP CONSTRAINT "FK_e20c18f7a2f52d43e61d4e45262"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments_reactions" DROP CONSTRAINT "FK_e63034c5ccf748507ff24c87f50"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts_reactions" DROP CONSTRAINT "FK_6cd2357793da928bfcf5f053336"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts_reactions" DROP CONSTRAINT "FK_eda6a30b689770336fff10ee39d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_e6d38899c31997c45d128a8973b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_111d467fb4b0704ae501fec1c36"`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_members" DROP CONSTRAINT "FK_46eb2c3e2d8b84acbd9a78974ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_members" DROP CONSTRAINT "FK_9cee09a19a82ecaf3b037f6e127"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_b52dd2ad41a295a40e6714fe2cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_63078ada3266846e539d930b1be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_312c63be865c81b922e39c2475e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_6435318a5112f571b038c1084df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "colleagueships" DROP CONSTRAINT "FK_113cc106c8dac85624b9373f454"`,
    );
    await queryRunner.query(
      `ALTER TABLE "colleagueships" DROP CONSTRAINT "FK_e3f335485ce0c0f427b71311f05"`,
    );
    await queryRunner.query(`DROP TABLE "comments_reactions"`);
    await queryRunner.query(`DROP TABLE "posts_reactions"`);
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "community_members"`);
    await queryRunner.query(`DROP TABLE "communities"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TABLE "colleagueships"`);
    await queryRunner.query(`DROP TABLE "user_profiles"`);
  }
}
