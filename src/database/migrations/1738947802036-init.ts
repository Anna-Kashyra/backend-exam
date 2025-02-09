import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1738947802036 implements MigrationInterface {
  name = 'Init1738947802036';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."posts_category_enum" AS ENUM('Technology', 'Lifestyle', 'Health', 'Finance', 'Entertainment')`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD "category" "public"."posts_category_enum" NOT NULL DEFAULT 'Technology'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "category"`);
    await queryRunner.query(`DROP TYPE "public"."posts_category_enum"`);
  }
}
