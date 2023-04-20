import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1682025075452 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS\`user\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`isActive\` tinyint NOT NULL DEFAULT '1',
        \`email\` varchar(50) NOT NULL,
        \`firstName\` varchar(30) NOT NULL,
        \`lastName\` varchar(30) NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=292 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `user`;');
  }
}
