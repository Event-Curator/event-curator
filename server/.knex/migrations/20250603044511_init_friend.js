export async function up(knex) {
  await knex.schema.createTable('friend', (table) => {
    table.string('user_uid').notNullable();             // one side of the friendship
    table.string('friend_uid').notNullable();           // the other side

    table.primary(['user_uid', 'friend_uid']);          // composite primary key to avoid duplicates

    table.foreign('user_uid').references('users.uid').onDelete('CASCADE');
    table.foreign('friend_uid').references('users.uid').onDelete('CASCADE');

    table.timestamp('friendship_created_at').defaultTo(knex.fn.now()); // optional: friendship timestamp
  });
}

export async function down(knex) {
  await knex.schema.dropTable('friend');
}
