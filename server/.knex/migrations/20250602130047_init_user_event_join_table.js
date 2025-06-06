export async function up(knex) {
  await knex.schema.createTable('user_events', (table) => {
    table.string('user_uid').notNullable();               // References users.uid
    table.uuid('event_id').notNullable();                 // References events.id

    table.primary(['user_uid', 'event_id']);              // Composite primary key

    table.foreign('user_uid').references('users.uid').onDelete('CASCADE');
    table.foreign('event_id').references('events.id').onDelete('CASCADE');

    table.timestamp('joined_at').defaultTo(knex.fn.now()); // Optional: when the user joined the event
  });
}

export async function down(knex) {
  await knex.schema.dropTable('user_events');
}
