export async function up(knex) {
    await knex.schema.table('user_events', function(table) {
        table.dropForeign('event_id');
      });
};

export async function down(knex) {
    await knex.schema.alterTable('user_events', (table) => {
        table.foreign('event_id').references('events.id').onDelete('CASCADE');
    })
};
