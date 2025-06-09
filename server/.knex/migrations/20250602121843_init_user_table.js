export async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.string('uid').primary();                        // Firebase UID
    table.string('email').notNullable();                  // Email address
    table.string('display_name');                         // Optional display name
    table.boolean('email_verified').defaultTo(false);     // Email verified status
    table.string('photo_url');                            // Optional photo URL
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Account creation time
  });
}

export async function down(knex) {
  await knex.schema.dropTable('users');
}
