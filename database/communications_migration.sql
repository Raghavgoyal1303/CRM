-- ── 1. OUTBOUND CAMPAIGNS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS outbound_campaigns (
  id                CHAR(36)     PRIMARY KEY,
  company_id        CHAR(36)     NOT NULL,
  name              VARCHAR(100) NOT NULL,
  description       TEXT,
  total_numbers     INT          DEFAULT 0,
  daily_limit       INT          DEFAULT 1000,
  calls_made_today  INT          DEFAULT 0,
  status            ENUM('draft','running','paused','completed') DEFAULT 'draft',
  started_at        DATETIME,
  completed_at      DATETIME,
  created_by        CHAR(36),
  created_at        DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── 2. OUTBOUND NUMBERS (the 10 lakh database) ────────────
CREATE TABLE IF NOT EXISTS outbound_numbers (
  id                  CHAR(36)  PRIMARY KEY,
  company_id          CHAR(36)  NOT NULL,
  campaign_id         CHAR(36)  NOT NULL,
  phone_number        VARCHAR(20) NOT NULL,
  call_attempts       INT       DEFAULT 0,
  last_call_status    ENUM(
    'pending','dialing','answered','busy',
    'interested','not_interested',
    'switched_off','not_reachable','failed'
  ) DEFAULT 'pending',
  last_called_at      DATETIME,
  is_blacklisted      TINYINT(1) DEFAULT 0,
  blacklisted_at      DATETIME,
  blacklist_reason    VARCHAR(100),
  called_today        TINYINT(1) DEFAULT 0,
  created_at          DATETIME  DEFAULT CURRENT_TIMESTAMP
);

-- ── 3. OUTBOUND INTERESTED LEADS ─────────────────────────
CREATE TABLE IF NOT EXISTS outbound_leads (
  id                  CHAR(36)     PRIMARY KEY,
  company_id          CHAR(36)     NOT NULL,
  outbound_number_id  CHAR(36),
  campaign_id         CHAR(36),
  phone_number        VARCHAR(20)  NOT NULL,
  name                VARCHAR(100),
  project_location    VARCHAR(150),
  budget              VARCHAR(50),
  down_payment        VARCHAR(50),
  site_visit_date     DATE,
  call_recording_url  TEXT,
  agent_id            CHAR(36),
  reminder_call_at    DATETIME,
  notes               TEXT,
  status              ENUM('new','reminder_set','visited','closed','lost') DEFAULT 'new',
  converted_to_lead   TINYINT(1)   DEFAULT 0,
  converted_lead_id   CHAR(36),
  created_at          DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── 4. BLACKLIST (global per company) ─────────────────────
CREATE TABLE IF NOT EXISTS blacklist (
  id              CHAR(36)     PRIMARY KEY,
  company_id      CHAR(36)     NOT NULL,
  phone_number    VARCHAR(20)  NOT NULL,
  reason          ENUM('not_interested','do_not_call','wrong_number','other') DEFAULT 'not_interested',
  added_by        CHAR(36),
  added_at        DATETIME     DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_blacklist (company_id, phone_number)
);

-- ── 5. COMMUNICATION LOGS (SMS + WhatsApp tracking) ───────
CREATE TABLE IF NOT EXISTS communication_logs (
  id              CHAR(36)    PRIMARY KEY,
  company_id      CHAR(36)    NOT NULL,
  lead_id         CHAR(36),
  outbound_lead_id CHAR(36),
  phone_number    VARCHAR(20) NOT NULL,
  channel         ENUM('sms','whatsapp') NOT NULL,
  direction       ENUM('outbound','inbound') DEFAULT 'outbound',
  message_text    TEXT,
  status          ENUM('sent','delivered','read','failed','replied') DEFAULT 'sent',
  triggered_by    ENUM('missed_call','no_sms_reply','manual','campaign') DEFAULT 'missed_call',
  sent_at         DATETIME    DEFAULT CURRENT_TIMESTAMP,
  delivered_at    DATETIME,
  replied_at      DATETIME
);

-- ── 6. RETRY QUEUE (busy numbers waiting for callback) ────
CREATE TABLE IF NOT EXISTS retry_queue (
  id              CHAR(36)   PRIMARY KEY,
  company_id      CHAR(36)   NOT NULL,
  campaign_id     CHAR(36),
  outbound_num_id CHAR(36),
  phone_number    VARCHAR(20) NOT NULL,
  retry_reason    ENUM('busy','switched_off','not_reachable') NOT NULL,
  attempt_count   INT        DEFAULT 1,
  max_attempts    INT        DEFAULT 2,
  next_retry_at   DATETIME,
  status          ENUM('waiting','retrying','completed','abandoned') DEFAULT 'waiting',
  created_at      DATETIME   DEFAULT CURRENT_TIMESTAMP
);

-- ── 7. INBOUND AUTO-RESPONSE SETTINGS per company ─────────
CREATE TABLE IF NOT EXISTS auto_response_settings (
  id                        CHAR(36)  PRIMARY KEY,
  company_id                CHAR(36)  UNIQUE NOT NULL,
  sms_enabled               TINYINT(1) DEFAULT 0,
  sms_template              TEXT,
  sms_delay_minutes         INT       DEFAULT 2,
  whatsapp_enabled          TINYINT(1) DEFAULT 0,
  whatsapp_template         TEXT,
  whatsapp_brochure_url     TEXT,
  whatsapp_followup_enabled TINYINT(1) DEFAULT 0,
  whatsapp_followup_hours   INT       DEFAULT 2,
  created_at                DATETIME  DEFAULT CURRENT_TIMESTAMP,
  updated_at                DATETIME  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── 8. ADD COLUMNS TO EXISTING TABLES ─────────────────────
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS msg91_api_key      VARCHAR(255),
  ADD COLUMN IF NOT EXISTS msg91_sender_id    VARCHAR(50),
  ADD COLUMN IF NOT EXISTS whatsapp_api_key   VARCHAR(255),
  ADD COLUMN IF NOT EXISTS whatsapp_provider  ENUM('interakt','wati','aisensy') DEFAULT 'interakt',
  ADD COLUMN IF NOT EXISTS whatsapp_number    VARCHAR(20);

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS source_type ENUM('inbound','outbound','manual') DEFAULT 'inbound',
  ADD COLUMN IF NOT EXISTS sms_sent    TINYINT(1) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS wa_sent     TINYINT(1) DEFAULT 0;
