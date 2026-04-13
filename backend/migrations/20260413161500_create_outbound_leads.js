/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('outbound_leads', (table) => {
    table.uuid('id').primary();
    table.uuid('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE');
    table.uuid('campaign_id').references('id').inTable('outbound_campaigns').onDelete('SET NULL');
    table.string('name', 100).notNullable();
    table.string('phone_number', 20).notNullable();
    table.enum('status', ['raw', 'contacted', 'interested', 'reminder_set', 'converted', 'rejected']).defaultTo('raw');
    table.text('notes');
    table.string('budget', 50);
    table.string('project_location', 255);
    table.boolean('converted_to_lead').defaultTo(false);
    table.datetime('site_visit_date');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('outbound_leads');
};
