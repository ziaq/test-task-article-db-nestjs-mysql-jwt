import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1744911254027 implements MigrationInterface {
  name = 'Init1744911254027';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`refresh_sessions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`refreshTokenHash\` varchar(255) NOT NULL, \`fingerprint\` varchar(255) NOT NULL, \`expiresAt\` datetime NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`articles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`isPublic\` tinyint NOT NULL DEFAULT 0, \`tags\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`article_update_log\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`articleId\` int NULL, \`updatedById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_sessions\` ADD CONSTRAINT \`FK_78744bff965517952df6c02da76\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_a9d18538b896fe2a6762e143bea\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`article_update_log\` ADD CONSTRAINT \`FK_6f5d7c6702322081c3ba0f617ec\` FOREIGN KEY (\`articleId\`) REFERENCES \`articles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`article_update_log\` ADD CONSTRAINT \`FK_4a1e7dc1e0d6f9cd6e91a2fc1a8\` FOREIGN KEY (\`updatedById\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`article_update_log\` DROP FOREIGN KEY \`FK_4a1e7dc1e0d6f9cd6e91a2fc1a8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`article_update_log\` DROP FOREIGN KEY \`FK_6f5d7c6702322081c3ba0f617ec\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_a9d18538b896fe2a6762e143bea\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_sessions\` DROP FOREIGN KEY \`FK_78744bff965517952df6c02da76\``,
    );
    await queryRunner.query(`DROP TABLE \`article_update_log\``);
    await queryRunner.query(`DROP TABLE \`articles\``);
    await queryRunner.query(`DROP TABLE \`refresh_sessions\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
