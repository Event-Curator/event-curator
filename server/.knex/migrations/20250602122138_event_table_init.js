export async function up(knex) {
  await knex.schema.createTable('events', (table) => {
    table.uuid('id').primary();                           // UUID for each event
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Optional: track creation time
  });
}

export async function down(knex) {
  await knex.schema.dropTable('events');
}
