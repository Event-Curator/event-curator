export async function up(knex) {
    await knex.schema.alterTable('user_events', (table) => {
        table.dropColumn('event_id');
        table.string('event_external_id');
    })
};

export async function down(knex) {
    await knex.schema.alterTable('user_events', (table) => {
        table.dropColumn('event_external_id');
        table.uuid('event_id').notNullable();
    })
};
