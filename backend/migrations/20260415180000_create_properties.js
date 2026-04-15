
exports.up = function(knex) {
  return knex.schema.createTable('properties', table => {
    table.uuid('id').primary();
    table.uuid('company_id').notNullable();
    table.string('name').notNullable();
    table.text('description');
    table.decimal('price', 15, 2);
    table.string('location').notNullable();
    table.string('property_type').notNullable(); // Flat, Villa, Plot, Commercial, etc.
    table.string('ownership').notNullable(); // Our Project, Third-party
    table.json('details'); // JSON for flexible attributes (BHK, Area, etc.)
    table.json('media'); // JSON array of file paths
    table.timestamps(true, true);

    table.index(['company_id', 'property_type']);
    table.index(['location']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('properties');
};
