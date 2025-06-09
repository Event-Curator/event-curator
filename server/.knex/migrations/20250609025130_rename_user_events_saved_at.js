export async function up(knex) {
    await knex.schema.alterTable('user_events', (table) => {
        table.renameColumn('saved_at', 'created_at')
    })
};

export async function down(knex) {
    await knex.schema.alterTable('user_events', (table) => {
        table.renameColumn('created_at', 'saved_at')
    })
};
