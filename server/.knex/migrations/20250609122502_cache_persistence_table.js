export async function up(knex) {
    await knex.schema.createTable('backups', (table) => {
        table.increments('id').primary();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.binary('content').notNullable();
  });
}

export async function down(knex) {
  await knex.schema.dropTable('backups');
}
