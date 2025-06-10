export async function up(knex) {
  await knex.schema.createTable('events', (table) => {
    table.uuid('id').primary();                              // UUID for each event
    table.string('external_id').notNullable().unique();      // External reference ID
    table.timestamp('created_at').defaultTo(knex.fn.now());  // Track creation time
  });
}

export async function down(knex) {
  await knex.schema.dropTable('events');
}
