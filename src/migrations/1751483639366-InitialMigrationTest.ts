import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigrationTest1751483639366 implements MigrationInterface {
    name = 'InitialMigrationTest1751483639366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "RoleType" ("roleTypeId" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(255), "name" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_984b98dd07959da7293b45127ee" PRIMARY KEY ("roleTypeId"))`);
        await queryRunner.query(`CREATE TABLE "User" ("userId" uuid NOT NULL DEFAULT uuid_generate_v4(), "identificationNumber" character varying(50) NOT NULL, "fullName" character varying(255) NOT NULL, "email" character varying(150) NOT NULL, "password" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "roleTypeId" uuid, CONSTRAINT "PK_45f0625bd8172eb9c821c948a0f" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`ALTER TABLE "User" ADD CONSTRAINT "FK_53a59cb597a54e64678708ae3a6" FOREIGN KEY ("roleTypeId") REFERENCES "RoleType"("roleTypeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "FK_53a59cb597a54e64678708ae3a6"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "RoleType"`);
    }

}
