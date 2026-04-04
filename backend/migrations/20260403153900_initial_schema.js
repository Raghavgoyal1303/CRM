/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('companies', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
      table.string('name', 100).notNullable();
      table.string('owner_name', 100);
      table.string('email', 100).unique().notNullable();
      table.string('phone', 20);
      table.enum('subscription_status', ['trial', 'active', 'suspended', 'cancelled']).defaultTo('trial');
      table.date('trial_ends_at');
      table.integer('max_employees').defaultTo(5);
      table.string('exotel_api_key', 255);
      table.string('exotel_api_token', 255);
      table.string('exotel_sid', 100);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('employees', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
      table.uuid('company_id').references('id').inTable('companies').onDelete('CASCADE');
      table.string('name', 100).notNullable();
      table.string('phone_number', 20);
      table.string('email', 100).unique().notNullable();
      table.string('password_hash', 255).notNullable();
      table.enum('role', ['superadmin', 'admin', 'employee']).defaultTo('employee');
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('leads', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
      table.uuid('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE');
      table.string('phone_number', 20).notNullable();
      table.string('name', 100);
      table.string('source', 50).defaultTo('youtube');
      table.uuid('assigned_to').references('id').inTable('employees').onDelete('SET NULL');
      table.enum('status', ['new', 'contacted', 'interested', 'site_visit', 'closed', 'lost']).defaultTo('new');
      table.datetime('call_time');
      table.text('call_recording_url');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('lead_notes', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
      table.uuid('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE');
      table.uuid('lead_id').notNullable().references('id').inTable('leads').onDelete('CASCADE');
      table.uuid('employee_id').notNullable().references('id').inTable('employees').onDelete('CASCADE');
      table.text('note').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('call_logs', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
      table.uuid('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE');
      table.uuid('lead_id').references('id').inTable('leads').onDelete('SET NULL');
      table.uuid('employee_id').references('id').inTable('employees').onDelete('SET NULL');
      table.enum('call_status', ['answered', 'missed']).notNullable();
      table.integer('duration').defaultTo(0);
      table.text('recording_url');
      table.timestamp('timestamp').defaultTo(knex.fn.now());
    })
    .createTable('follow_ups', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
      table.uuid('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE');
      table.uuid('lead_id').notNullable().references('id').inTable('leads').onDelete('CASCADE');
      table.uuid('employee_id').notNullable().references('id').inTable('employees').onDelete('CASCADE');
      table.datetime('next_followup_date').notNullable();
      table.text('note');
      table.boolean('is_done').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('assignment_pointers', (table) => {
      table.uuid('company_id').primary().references('id').inTable('companies').onDelete('CASCADE');
      table.integer('last_index').defaultTo(0);
    })
    .createTable('outbound_campaigns', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
      table.uuid('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE');
      table.string('name', 255).notNullable();
      table.text('description');
      table.integer('daily_limit').defaultTo(1000);
      table.enum('status', ['draft', 'running', 'paused', 'completed']).defaultTo('draft');
      table.uuid('created_by').references('id').inTable('employees').onDelete('SET NULL');
      table.datetime('started_at');
      table.integer('total_numbers').defaultTo(0);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('outbound_numbers', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
      table.uuid('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE');
      table.uuid('campaign_id').notNullable().references('id').inTable('outbound_campaigns').onDelete('CASCADE');
      table.string('phone_number', 20).notNullable();
      table.string('last_call_status', 50).defaultTo('pending');
    })
    .createTable('activity_logs', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
      table.uuid('company_id').references('id').inTable('companies').onDelete('CASCADE');
      table.uuid('user_id').references('id').inTable('employees').onDelete('SET NULL');
      table.string('action', 255).notNullable();
      table.text('details');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('activity_logs')
    .dropTableIfExists('outbound_numbers')
    .dropTableIfExists('outbound_campaigns')
    .dropTableIfExists('assignment_pointers')
    .dropTableIfExists('follow_ups')
    .dropTableIfExists('call_logs')
    .dropTableIfExists('lead_notes')
    .dropTableIfExists('leads')
    .dropTableIfExists('employees')
    .dropTableIfExists('companies');
};
