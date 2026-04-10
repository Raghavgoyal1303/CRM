CREATE DATABASE IF NOT EXISTS Tricity Verified_db;
USE Tricity Verified_db;

-- COMPANIES (tenants)
CREATE TABLE companies (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL,
  owner_name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  subscription_status ENUM('trial','active','suspended','cancelled') DEFAULT 'trial',
  trial_ends_at DATE,
  max_employees INT DEFAULT 5,
  exotel_api_key VARCHAR(255),
  exotel_api_token VARCHAR(255),
  exotel_sid VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- EMPLOYEES (users â€” admin, employee, superadmin)
CREATE TABLE employees (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  company_id CHAR(36),                          -- NULL for superadmin
  name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('superadmin','admin','employee') DEFAULT 'employee',
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- LEADS
CREATE TABLE leads (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  company_id CHAR(36) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  name VARCHAR(100),
  source VARCHAR(50) DEFAULT 'youtube',
  assigned_to CHAR(36),
  status ENUM('new','contacted','interested','site_visit','closed','lost') DEFAULT 'new',
  call_time DATETIME,
  call_recording_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (assigned_to) REFERENCES employees(id)
);

-- LEAD NOTES
CREATE TABLE lead_notes (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  company_id CHAR(36) NOT NULL,
  lead_id CHAR(36) NOT NULL,
  employee_id CHAR(36) NOT NULL,
  note TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (lead_id) REFERENCES leads(id),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- CALL LOGS
CREATE TABLE call_logs (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  company_id CHAR(36) NOT NULL,
  lead_id CHAR(36),
  employee_id CHAR(36),
  call_status ENUM('answered','missed') NOT NULL,
  duration INT DEFAULT 0,
  recording_url TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (lead_id) REFERENCES leads(id),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- FOLLOW-UPS
CREATE TABLE follow_ups (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  company_id CHAR(36) NOT NULL,
  lead_id CHAR(36) NOT NULL,
  employee_id CHAR(36) NOT NULL,
  next_followup_date DATETIME NOT NULL,
  note TEXT,
  is_done TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (lead_id) REFERENCES leads(id),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- ROUND ROBIN per company
CREATE TABLE assignment_pointers (
  company_id CHAR(36) PRIMARY KEY,
  last_index INT DEFAULT 0,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- SEED: Super Admin (you)
INSERT INTO employees (id, name, email, password_hash, role, company_id)
VALUES (UUID(), 'Super Admin', 'you@Tricity Verified.com', '$2b$10$YourHashedPasswordHere', 'superadmin', NULL);

