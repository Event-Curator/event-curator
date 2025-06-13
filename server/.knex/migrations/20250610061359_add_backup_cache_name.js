export async function up(knex) {
    await knex.schema.alterTable('backups', (table) => {
        table.string('cache_name').defaultTo("events");
    })
};

export async function down(knex) {
    await knex.schema.alterTable('backups', (table) => {
        table.dropColumn('cache_name');
    })
};
