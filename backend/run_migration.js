const { pool } = require('./src/config/db');

async function runMigration() {
  const connection = await pool.getConnection();

  const tables = [
    `CREATE TABLE IF NOT EXISTS lottery_campaigns (
      id                  CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
      company_id          CHAR(36)      NOT NULL,
      name                VARCHAR(200)  NOT NULL,
      description         TEXT,
      price_per_token     DECIMAL(10,2) NOT NULL DEFAULT 1100.00,
      total_tokens        INT           NOT NULL DEFAULT 100000,
      tokens_sold         INT           DEFAULT 0,
      campaign_start_date DATE          NOT NULL,
      campaign_end_date   DATE          NOT NULL,
      draw_date           DATE,
      prize_description   TEXT,
      prize_value         DECIMAL(12,2),
      winners_count       INT           DEFAULT 100,
      refund_amount       DECIMAL(10,2) DEFAULT 1100.00,
      status              ENUM('draft','active','completed','cancelled') DEFAULT 'draft',
      created_by          CHAR(36),
      created_at          DATETIME      DEFAULT CURRENT_TIMESTAMP,
      updated_at          DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS lottery_participants (
      id                  CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
      company_id          CHAR(36)      NOT NULL,
      campaign_id         CHAR(36)      NOT NULL,
      token_number        VARCHAR(20)   NOT NULL UNIQUE,
      full_name           VARCHAR(150)  NOT NULL,
      father_name         VARCHAR(150),
      date_of_birth       DATE,
      gender              ENUM('male','female','other'),
      phone_number        VARCHAR(20)   NOT NULL,
      alternate_phone     VARCHAR(20),
      email               VARCHAR(100),
      address_line1       VARCHAR(255),
      address_line2       VARCHAR(255),
      city                VARCHAR(100),
      state               VARCHAR(100),
      pincode             VARCHAR(10),
      aadhar_number       VARCHAR(20),
      pan_number          VARCHAR(20),
      payment_status      ENUM('pending','paid','refunded','failed') DEFAULT 'pending',
      payment_method      ENUM('cash','upi','netbanking','card','cheque'),
      payment_reference   VARCHAR(100),
      payment_date        DATETIME,
      payment_amount      DECIMAL(10,2) DEFAULT 1100.00,
      is_winner           TINYINT(1)    DEFAULT 0,
      prize_details       TEXT,
      prize_delivered     TINYINT(1)    DEFAULT 0,
      refund_status       ENUM('pending','processed','completed') DEFAULT 'pending',
      refund_date         DATETIME,
      notes               TEXT,
      added_by            CHAR(36),
      source              ENUM('manual','excel_import','api') DEFAULT 'manual',
      created_at          DATETIME      DEFAULT CURRENT_TIMESTAMP,
      updated_at          DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS lottery_winners (
      id                CHAR(36)  PRIMARY KEY DEFAULT (UUID()),
      company_id        CHAR(36)  NOT NULL,
      campaign_id       CHAR(36)  NOT NULL,
      participant_id    CHAR(36)  NOT NULL,
      token_number      VARCHAR(20),
      prize_rank        INT,
      prize_description TEXT,
      prize_value       DECIMAL(12,2),
      announced_at      DATETIME,
      prize_delivered   TINYINT(1) DEFAULT 0,
      delivery_date     DATETIME,
      notes             TEXT,
      created_at        DATETIME  DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS api_keys (
      id              CHAR(36)     PRIMARY KEY DEFAULT (UUID()),
      company_id      CHAR(36)     NOT NULL,
      name            VARCHAR(100) NOT NULL,
      description     TEXT,
      key_hash        VARCHAR(255) NOT NULL UNIQUE,
      key_preview     VARCHAR(20)  NOT NULL,
      permissions     JSON         NOT NULL,
      environment     ENUM('live','test') DEFAULT 'live',
      is_active       TINYINT(1)   DEFAULT 1,
      rate_limit      INT          DEFAULT 1000,
      calls_this_month INT         DEFAULT 0,
      last_used_at    DATETIME,
      last_used_ip    VARCHAR(45),
      expires_at      DATETIME,
      created_by      CHAR(36),
      revoked_at      DATETIME,
      revoked_by      CHAR(36),
      created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS api_request_logs (
      id            CHAR(36)     PRIMARY KEY DEFAULT (UUID()),
      company_id    CHAR(36)     NOT NULL,
      api_key_id    CHAR(36)     NOT NULL,
      method        VARCHAR(10),
      endpoint      VARCHAR(255),
      status_code   INT,
      response_time INT,
      ip_address    VARCHAR(45),
      user_agent    TEXT,
      request_body  JSON,
      created_at    DATETIME     DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS live_calls (
      id              CHAR(36)    PRIMARY KEY DEFAULT (UUID()),
      company_id      CHAR(36)    NOT NULL,
      call_sid        VARCHAR(100) UNIQUE,
      caller_number   VARCHAR(20),
      employee_id     CHAR(36),
      lead_id         CHAR(36),
      direction       ENUM('inbound','outbound') DEFAULT 'inbound',
      started_at      DATETIME    DEFAULT CURRENT_TIMESTAMP,
      status          ENUM('ringing','in-progress','completed','failed') DEFAULT 'ringing'
    )`,
    `CREATE TABLE IF NOT EXISTS audit_logs (
      id            CHAR(36)     PRIMARY KEY DEFAULT (UUID()),
      company_id    CHAR(36),
      performed_by  CHAR(36),
      action        VARCHAR(100) NOT NULL,
      entity_type   VARCHAR(50),
      entity_id     CHAR(36),
      old_value     JSON,
      new_value     JSON,
      ip_address    VARCHAR(45),
      user_agent    TEXT,
      created_at    DATETIME     DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS lead_locks (
      id            CHAR(36)  PRIMARY KEY DEFAULT (UUID()),
      lead_id       CHAR(36)  NOT NULL UNIQUE,
      locked_by     CHAR(36)  NOT NULL,
      locked_at     DATETIME  DEFAULT CURRENT_TIMESTAMP,
      expires_at    DATETIME  NOT NULL
    )`
  ];

  try {
    for (let tableSql of tables) {
      await connection.query(tableSql);
      console.log('Processed table:', tableSql.split('(')[0].trim());
    }

    // Handle ALTER TABLE for leads
    const [leadsCols] = await connection.query('SHOW COLUMNS FROM leads');
    const leadsColNames = leadsCols.map(c => c.Field);
    
    if (!leadsColNames.includes('deleted_at')) {
      await connection.query('ALTER TABLE leads ADD COLUMN deleted_at DATETIME DEFAULT NULL');
      console.log('Added deleted_at to leads');
    }
    if (!leadsColNames.includes('app_name')) {
      await connection.query('ALTER TABLE leads ADD COLUMN app_name VARCHAR(100) DEFAULT "Exotel"');
      console.log('Added app_name to leads');
    }

    // Handle ALTER TABLE for employees
    const [empCols] = await connection.query('SHOW COLUMNS FROM employees');
    const empColNames = empCols.map(c => c.Field);
    
    if (!empColNames.includes('deleted_at')) {
      await connection.query('ALTER TABLE employees ADD COLUMN deleted_at DATETIME DEFAULT NULL');
      console.log('Added deleted_at to employees');
    }

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    connection.release();
    process.exit();
  }
}

runMigration();
