export async function up(knex) {
  await knex.schema.createTable('shared_timeline', (table) => {
    table.string('user_uid').notNullable();               // References users.uid
    table.string('event_external_id').notNullable();                 // References events.id

    table.primary(['user_uid', 'event_external_id']);              // Composite primary key

    table.foreign('user_uid').references('users.uid').onDelete('CASCADE');
    table.foreign('event_external_id').references('events.external_id').onDelete('CASCADE');

    table.timestamp('shared_at').defaultTo(knex.fn.now()); // Optional: when the user joined the event
  });
}

export async function down(knex) {
  await knex.schema.dropTable('shared_timeline');
}
