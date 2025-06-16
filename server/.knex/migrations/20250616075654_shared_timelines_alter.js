export async function up(knex) {
    await knex.schema.alterTable('shared_timeline', (table) => {
        table.string("signature")
    })
};

export async function down(knex) {
    await knex.schema.alterTable('shared_timeline', (table) => {
        table.dropColumn("signature");
    })
};
