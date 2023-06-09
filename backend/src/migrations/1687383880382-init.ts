import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1687383880382 implements MigrationInterface {
    name = 'Init1687383880382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rutines_assignment" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "routine_id" integer, "user_id" integer, CONSTRAINT "PK_05a1cacdb577cc8df7b81cc9128" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "routines" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "instructor_id" integer, CONSTRAINT "PK_6847e8f0f74e65a6f10409dee9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "rutines_assignment" ADD CONSTRAINT "FK_15f5c52c5f6ea4dc334e2ab56e5" FOREIGN KEY ("routine_id") REFERENCES "routines"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rutines_assignment" ADD CONSTRAINT "FK_997bde8d79222663a71a3458bcd" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "routines" ADD CONSTRAINT "FK_1c2aa0c7f04f6b448435e9cf248" FOREIGN KEY ("instructor_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "routines" DROP CONSTRAINT "FK_1c2aa0c7f04f6b448435e9cf248"`);
        await queryRunner.query(`ALTER TABLE "rutines_assignment" DROP CONSTRAINT "FK_997bde8d79222663a71a3458bcd"`);
        await queryRunner.query(`ALTER TABLE "rutines_assignment" DROP CONSTRAINT "FK_15f5c52c5f6ea4dc334e2ab56e5"`);
        await queryRunner.query(`DROP TABLE "routines"`);
        await queryRunner.query(`DROP TABLE "rutines_assignment"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
