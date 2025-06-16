export async function up(knex) {
  await knex.schema.createTable('shared_timeline', (table) => {
    table.string('user_uid').notNullable();               // References users.uid
    table.string('event_external_id').notNullable();                 // References events.id
    table.string("signature").notNullable();
    table.timestamp('created_at').notNullable();
    table.timestamp('shared_at').defaultTo(knex.fn.now()); // Optional: when the user joined the event
  });
}

export async function down(knex) {
  await knex.schema.dropTable('shared_timeline');
}
