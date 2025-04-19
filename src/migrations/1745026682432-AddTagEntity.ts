import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTagEntity1745026682432 implements MigrationInterface {
    name = 'AddTagEntity1745026682432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_a9d18538b896fe2a6762e143bea\``);
        await queryRunner.query(`CREATE TABLE \`tags\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_d90243459a697eadb8ad56e909\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`articles_tags_tags\` (\`articlesId\` int NOT NULL, \`tagsId\` int NOT NULL, INDEX \`IDX_0adb8d108330d74e4a7f7d29de\` (\`articlesId\`), INDEX \`IDX_dcd523dc6473a35e6cb0cbf9f2\` (\`tagsId\`), PRIMARY KEY (\`articlesId\`, \`tagsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP COLUMN \`tags\``);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD \`createdByUserId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_c286ecec60d3839380b253e54f4\` FOREIGN KEY (\`createdByUserId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`articles_tags_tags\` ADD CONSTRAINT \`FK_0adb8d108330d74e4a7f7d29de2\` FOREIGN KEY (\`articlesId\`) REFERENCES \`articles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`articles_tags_tags\` ADD CONSTRAINT \`FK_dcd523dc6473a35e6cb0cbf9f2d\` FOREIGN KEY (\`tagsId\`) REFERENCES \`tags\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles_tags_tags\` DROP FOREIGN KEY \`FK_dcd523dc6473a35e6cb0cbf9f2d\``);
        await queryRunner.query(`ALTER TABLE \`articles_tags_tags\` DROP FOREIGN KEY \`FK_0adb8d108330d74e4a7f7d29de2\``);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_c286ecec60d3839380b253e54f4\``);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP COLUMN \`createdByUserId\``);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD \`tags\` text NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_dcd523dc6473a35e6cb0cbf9f2\` ON \`articles_tags_tags\``);
        await queryRunner.query(`DROP INDEX \`IDX_0adb8d108330d74e4a7f7d29de\` ON \`articles_tags_tags\``);
        await queryRunner.query(`DROP TABLE \`articles_tags_tags\``);
        await queryRunner.query(`DROP INDEX \`IDX_d90243459a697eadb8ad56e909\` ON \`tags\``);
        await queryRunner.query(`DROP TABLE \`tags\``);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_a9d18538b896fe2a6762e143bea\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
