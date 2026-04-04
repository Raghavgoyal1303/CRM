/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .alterTable('leads', (table) => {
      table.index(['company_id'], 'idx_leads_company');
      table.index(['phone_number'], 'idx_leads_phone');
      table.index(['assigned_to'], 'idx_leads_assigned');
      table.index(['status'], 'idx_leads_status');
    })
    .alterTable('call_logs', (table) => {
      table.index(['company_id'], 'idx_calls_company');
      table.index(['lead_id'], 'idx_calls_lead');
      table.index(['timestamp'], 'idx_calls_time');
    })
    .alterTable('employees', (table) => {
      table.index(['company_id'], 'idx_emp_company');
    })
    .alterTable('follow_ups', (table) => {
      table.index(['company_id', 'is_done', 'next_followup_date'], 'idx_followups_active');
    })
    .alterTable('activity_logs', (table) => {
      table.index(['company_id'], 'idx_activity_company');
      table.index(['created_at'], 'idx_activity_time');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .alterTable('leads', (table) => {
      table.dropIndex([], 'idx_leads_company');
      table.dropIndex([], 'idx_leads_phone');
      table.dropIndex([], 'idx_leads_assigned');
      table.dropIndex([], 'idx_leads_status');
    })
    .alterTable('call_logs', (table) => {
      table.dropIndex([], 'idx_calls_company');
      table.dropIndex([], 'idx_calls_lead');
      table.dropIndex([], 'idx_calls_time');
    })
    .alterTable('employees', (table) => {
      table.dropIndex([], 'idx_emp_company');
    })
    .alterTable('follow_ups', (table) => {
      table.dropIndex([], 'idx_followups_active');
    })
    .alterTable('activity_logs', (table) => {
      table.dropIndex([], 'idx_activity_company');
      table.dropIndex([], 'idx_activity_time');
    });
};
