import { MigrationInterface, QueryRunner } from 'typeorm';

export class SnappfoodBackendClone1737142149499 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`payment\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`order_item\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`order\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`user_address\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`feedback\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`basket\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`discount\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`menu\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`menu_type\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`supplier\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`user\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`supplier_otp\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`supplier_docs\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`otp\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`category\`;`);

    await queryRunner.query(`
    CREATE TABLE \`category\` (
      id int NOT NULL AUTO_INCREMENT,
      title varchar(255) NOT NULL,
      slug varchar(255) NOT NULL,
      image varchar(255) NOT NULL,
      imageKey varchar(255) DEFAULT NULL,
      \`show\` tinyint NOT NULL,
      parentId int DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY IDX_cb73208f151aa71cdd78f662d7 (slug),
      KEY FK_d5456fd7e4c4866fec8ada1fa10 (parentId),
      CONSTRAINT FK_d5456fd7e4c4866fec8ada1fa10 FOREIGN KEY (parentId) REFERENCES \`category\` (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
    CREATE TABLE \`otp\` (
      id int NOT NULL AUTO_INCREMENT,
      code varchar(255) NOT NULL,
      expires_in datetime NOT NULL,
      userId int NOT NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
    CREATE TABLE \`supplier_docs\` (
      id int NOT NULL AUTO_INCREMENT,
      supplierId int NOT NULL,
      acceptedDoc varchar(255) NOT NULL,
      image varchar(255) NOT NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
    CREATE TABLE \`supplier_otp\` (
      id int NOT NULL AUTO_INCREMENT,
      code varchar(255) NOT NULL,
      expires_in datetime NOT NULL,
      supplierId int NOT NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
    CREATE TABLE \`user\` (
        id int NOT NULL AUTO_INCREMENT,
        first_name varchar(255) DEFAULT NULL,
        last_name varchar(255) DEFAULT NULL,
        mobile varchar(255) NOT NULL,
        mobile_verify tinyint DEFAULT '0',
        email varchar(255) DEFAULT NULL,
        invite_code varchar(255) NOT NULL,
        score int NOT NULL DEFAULT '0',
        agent_id int DEFAULT NULL,
        otpId int DEFAULT NULL,
        created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        UNIQUE KEY IDX_29fd51e9cf9241d022c5a4e02e (mobile),
        UNIQUE KEY IDX_afbd6aa2cb8da01c11e1f9519f (invite_code),
        UNIQUE KEY REL_483a6adaf636e520039e97ef61 (otpId),
      CONSTRAINT FK_483a6adaf636e520039e97ef617 FOREIGN KEY (otpId) REFERENCES otp (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
    CREATE TABLE \`supplier\` (
      id int NOT NULL AUTO_INCREMENT,
      manager_name varchar(255) NOT NULL,
      manager_family varchar(255) NOT NULL,
      national_code varchar(255) DEFAULT NULL,
      email varchar(255) DEFAULT NULL,
      status varchar(255) NOT NULL DEFAULT 'registered',
      mobile varchar(255) NOT NULL,
      mobile_verify tinyint DEFAULT '0',
      store_name varchar(255) NOT NULL,
      category_id int NOT NULL,
      invite_code varchar(255) NOT NULL,
      agentId int DEFAULT NULL,
      otpId int DEFAULT NULL,
      docsId int DEFAULT NULL,
      created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      updated_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      categoryId int DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY IDX_f1ed5051f60951eba384f36175 (mobile),
      UNIQUE KEY IDX_7f22777d941a89e36cd51da21b (national_code),
      UNIQUE KEY IDX_c40cbff7400f06ae1c8d9f4233 (email),
      UNIQUE KEY REL_f93bbb8ccb3547ad2b6f2f1de5 (otpId),
      UNIQUE KEY REL_05217f561a8b168057e7577a3a (docsId),
      KEY FK_13d4807875d76e6a4ae8ae16e66 (categoryId),
      KEY FK_862d7885373f4657a48193a41d3 (agentId),
      CONSTRAINT FK_05217f561a8b168057e7577a3a9 FOREIGN KEY (docsId) REFERENCES \`supplier_docs\` (id),
      CONSTRAINT FK_13d4807875d76e6a4ae8ae16e66 FOREIGN KEY (categoryId) REFERENCES \`category\` (id) ON DELETE SET NULL,
      CONSTRAINT FK_862d7885373f4657a48193a41d3 FOREIGN KEY (agentId) REFERENCES \`supplier\` (id),
      CONSTRAINT FK_f93bbb8ccb3547ad2b6f2f1de5c FOREIGN KEY (otpId) REFERENCES \`supplier_otp\` (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
    CREATE TABLE \`user_address\` (
      id int NOT NULL AUTO_INCREMENT,
      title varchar(255) NOT NULL,
      province varchar(255) NOT NULL,
      city varchar(255) NOT NULL,
      address varchar(255) NOT NULL,
      postal_code varchar(255) DEFAULT NULL,
      userId int NOT NULL,
      created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      PRIMARY KEY (id),
      KEY FK_1abd8badc4a127b0f357d9ecbc2 (userId),
      CONSTRAINT FK_1abd8badc4a127b0f357d9ecbc2 FOREIGN KEY (userId) REFERENCES \`user\` (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
    CREATE TABLE \`order\` (
      id int NOT NULL AUTO_INCREMENT,
      userId int NOT NULL,
      addressId int DEFAULT NULL,
      payment_amount int NOT NULL,
      discount_amount int NOT NULL,
      total_amount int NOT NULL,
      description varchar(255) DEFAULT NULL,
      status enum('pending','canceled','paid','done') NOT NULL DEFAULT 'pending',
      PRIMARY KEY (id),
      KEY FK_caabe91507b3379c7ba73637b84 (userId),
      KEY FK_73f9a47e41912876446d047d015 (addressId),
      CONSTRAINT FK_73f9a47e41912876446d047d015 FOREIGN KEY (addressId) REFERENCES \`user_address\` (id) ON DELETE SET NULL,
      CONSTRAINT FK_caabe91507b3379c7ba73637b84 FOREIGN KEY (userId) REFERENCES \`user\` (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
    CREATE TABLE \`payment\` (
      id int NOT NULL AUTO_INCREMENT,
      status tinyint NOT NULL DEFAULT '0',
      amount int NOT NULL,
      invoice_number varchar(255) NOT NULL,
      authority varchar(255) DEFAULT NULL,
      invoice_date datetime NOT NULL,
      userId int NOT NULL,
      orderId int NOT NULL,
      created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      PRIMARY KEY (id),
      KEY FK_b046318e0b341a7f72110b75857 (userId),
      KEY FK_d09d285fe1645cd2f0db811e293 (orderId),
      CONSTRAINT FK_b046318e0b341a7f72110b75857 FOREIGN KEY (userId) REFERENCES \`user\` (id) ON DELETE CASCADE,
      CONSTRAINT FK_d09d285fe1645cd2f0db811e293 FOREIGN KEY (orderId) REFERENCES \`order\` (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
    CREATE TABLE \`menu_type\` (
      id int NOT NULL AUTO_INCREMENT,
      title varchar(255) NOT NULL,
      supplierId int NOT NULL,
      PRIMARY KEY (id),
      KEY FK_9b1ebcd96c5ad77c0c8e88cf1a6 (supplierId),
      CONSTRAINT FK_9b1ebcd96c5ad77c0c8e88cf1a6 FOREIGN KEY (supplierId) REFERENCES \`supplier\` (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
    CREATE TABLE \`menu\` (
      id int NOT NULL AUTO_INCREMENT,
      title varchar(255) NOT NULL,
      image varchar(255) NOT NULL,
      imageKey varchar(255) NOT NULL,
      price double NOT NULL,
      discount double NOT NULL DEFAULT '0',
      description varchar(255) NOT NULL,
      score double NOT NULL DEFAULT '0',
      typeId int NOT NULL,
      supplierId int NOT NULL,
      PRIMARY KEY (id),
      KEY FK_83428343d7b5010847449e70f0f (typeId),
      KEY FK_ab2a728431b513af50b92ad15b9 (supplierId),
      CONSTRAINT FK_83428343d7b5010847449e70f0f FOREIGN KEY (typeId) REFERENCES \`menu_type\` (id),
      CONSTRAINT FK_ab2a728431b513af50b92ad15b9 FOREIGN KEY (supplierId) REFERENCES \`supplier\` (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
    CREATE TABLE \`order_item\` (
      id int NOT NULL AUTO_INCREMENT,
      foodId int NOT NULL,
      orderId int NOT NULL,
      count int NOT NULL,
      supplierId int NOT NULL,
      status enum('pending','canceled','sent') NOT NULL DEFAULT 'pending',
      PRIMARY KEY (id),
      KEY FK_eefd7c5ad8708989375a9db7b5e (foodId),
      KEY FK_646bf9ece6f45dbe41c203e06e0 (orderId),
      KEY FK_04ada750254b524ffdb53a9c5c2 (supplierId),
      CONSTRAINT FK_04ada750254b524ffdb53a9c5c2 FOREIGN KEY (supplierId) REFERENCES \`supplier\` (id) ON DELETE CASCADE,
      CONSTRAINT FK_646bf9ece6f45dbe41c203e06e0 FOREIGN KEY (orderId) REFERENCES \`order\` (id) ON DELETE CASCADE,
      CONSTRAINT FK_eefd7c5ad8708989375a9db7b5e FOREIGN KEY (foodId) REFERENCES \`menu\` (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
    CREATE TABLE \`feedback\` (
      id int NOT NULL AUTO_INCREMENT,
      userId int NOT NULL,
      foodId int NOT NULL,
      comment varchar(255) NOT NULL,
      created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      PRIMARY KEY (id),
      KEY FK_ba0448fd8f2d062a1caf2a11732 (foodId),
      KEY FK_4a39e6ac0cecdf18307a365cf3c (userId),
      CONSTRAINT FK_4a39e6ac0cecdf18307a365cf3c FOREIGN KEY (userId) REFERENCES \`user\` (id) ON DELETE CASCADE,
      CONSTRAINT FK_ba0448fd8f2d062a1caf2a11732 FOREIGN KEY (foodId) REFERENCES \`menu\` (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
    CREATE TABLE \`discount\` (
      id int NOT NULL AUTO_INCREMENT,
      code varchar(255) NOT NULL,
      percent double DEFAULT NULL,
      amount double DEFAULT NULL,
      expires_in datetime DEFAULT NULL,
      \`limit\` int DEFAULT NULL,
      \`usage\` int DEFAULT '0',
      \`active\` tinyint NOT NULL DEFAULT '1',
      supplierId int DEFAULT NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`
    CREATE TABLE \`basket\` (
      id int NOT NULL AUTO_INCREMENT,
      foodId int NOT NULL,
      userId int NOT NULL,
      count int NOT NULL,
      discountId int DEFAULT NULL,
      PRIMARY KEY (id),
      KEY FK_f944492305b6c1b64d4f4dffc0a (foodId),
      KEY FK_26dcb999420495bb5b14a4f8d1c (userId),
      KEY FK_937ec1af4f2b301d593f262cfef (discountId),
      CONSTRAINT FK_26dcb999420495bb5b14a4f8d1c FOREIGN KEY (userId) REFERENCES \`user\` (id) ON DELETE CASCADE,
      CONSTRAINT FK_937ec1af4f2b301d593f262cfef FOREIGN KEY (discountId) REFERENCES \`discount\` (id),
      CONSTRAINT FK_f944492305b6c1b64d4f4dffc0a FOREIGN KEY (foodId) REFERENCES \`menu\` (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`payment\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`order_item\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`order\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`user_address\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`feedback\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`basket\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`discount\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`menu\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`menu_type\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`supplier\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`user\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`supplier_otp\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`supplier_docs\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`otp\`;`);
    await queryRunner.query(`DROP TABLE IF EXISTS \`category\`;`);
  }
}
