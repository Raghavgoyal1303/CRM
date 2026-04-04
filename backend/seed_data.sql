-- LeadFlow CRM Sample Data Seed Script (SCHEMA FIXED)
-- ------------------------------------------------------
-- Instructions: 
-- 1. Open MySQL Workbench.
-- 2. Select your 'leadflow_db' database.
-- 3. Copy/Paste these commands into a new SQL query tab.
-- 4. Execute (Zap icon).
-- ------------------------------------------------------

USE leadflow_db;

-- Clear existing data (CAUTION: Clean slate for testing)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE follow_ups;
TRUNCATE TABLE call_logs;
TRUNCATE TABLE communication_logs;
TRUNCATE TABLE lead_notes;
TRUNCATE TABLE leads;
TRUNCATE TABLE outbound_numbers;
TRUNCATE TABLE outbound_campaigns;
TRUNCATE TABLE employees;
TRUNCATE TABLE companies;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. CREATE A TEST COMPANY
-- Column Fixed: owner_name, email, subscription_status
INSERT INTO companies (id, name, owner_name, email, phone, subscription_status, created_at)
VALUES ('hq_company_001', 'LeadFlow HQ', 'Raghav Goyal', 'owner@leadflow.com', '9999999999', 'active', NOW());

-- 2. CREATE OWNER AND EMPLOYEE ACCOUNTS
INSERT INTO employees (id, company_id, name, email, password_hash, role, is_active, created_at)
VALUES 
('owner_001', 'hq_company_001', 'Raghav Goyal (Owner)', 'owner@leadflow.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgNI9Xf99W8p7QfL1f.k5Q8nC9K.', 'admin', 1, NOW()),
('emp_001', 'hq_company_001', 'John Staff (Employee)', 'employee@leadflow.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgNI9Xf99W8p7QfL1f.k5Q8nC9K.', 'employee', 1, NOW());

-- 3. SAMPLE LEADS
-- Note: Leads table does not have an 'email' column based on schema check.
INSERT INTO leads (id, company_id, phone_number, name, source, status, created_at)
VALUES 
('lead_001', 'hq_company_001', '9876543210', 'Amit Sharma', 'manual', 'new', NOW()),
('lead_002', 'hq_company_001', '9876543211', 'Priya Singh', 'call', 'contacted', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('lead_003', 'hq_company_001', '9876543212', 'Vikram Rao', 'manual', 'interested', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('lead_004', 'hq_company_001', '9876543213', 'Sneha Kapoor', 'whatsapp', 'follow_up', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('lead_005', 'hq_company_001', '9876543214', 'Anil Mehta', 'manual', 'converted', DATE_SUB(NOW(), INTERVAL 10 DAY));

-- 4. SAMPLE CALL LOGS
-- Columns: id, company_id, lead_id, employee_id, call_status, duration, timestamp
INSERT INTO call_logs (id, company_id, lead_id, employee_id, call_status, duration, timestamp)
VALUES 
(UUID(), 'hq_company_001', 'lead_001', 'emp_001', 'answered', 120, NOW()),
(UUID(), 'hq_company_001', 'lead_002', 'emp_001', 'missed', 0, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(UUID(), 'hq_company_001', 'lead_003', 'owner_001', 'answered', 300, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- 5. SAMPLE FOLLOW-UPS
-- Columns: id, company_id, lead_id, employee_id, next_followup_date, note, is_done
INSERT INTO follow_ups (id, company_id, lead_id, employee_id, next_followup_date, note, is_done, created_at)
VALUES 
(UUID(), 'hq_company_001', 'lead_004', 'emp_001', DATE_ADD(NOW(), INTERVAL 2 DAY), 'Price discussion', 0, NOW()),
(UUID(), 'hq_company_001', 'lead_001', 'emp_001', DATE_SUB(NOW(), INTERVAL 1 DAY), 'Intro call done', 1, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- 6. SAMPLE CAMPAIGN
INSERT INTO outbound_campaigns (id, company_id, name, description, total_numbers, daily_limit, status, created_at)
VALUES ('camp_001', 'hq_company_001', 'Summer Solar Outbound', 'Targeting residential solar prospects', 500, 1000, 'running', NOW());

INSERT INTO outbound_numbers (id, company_id, campaign_id, phone_number, last_call_status)
VALUES 
(UUID(), 'hq_company_001', 'camp_001', '9000000001', 'pending'),
(UUID(), 'hq_company_001', 'camp_001', '9000000002', 'answered'),
(UUID(), 'hq_company_001', 'camp_001', '9000000003', 'interested');

-- Final Verification Note:
-- You can now login with:
-- Admin: owner@leadflow.com / admin123
-- Staff: employee@leadflow.com / admin123
