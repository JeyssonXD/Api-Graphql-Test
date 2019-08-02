
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('public').createTable('notification',function(table){
    table.increments('id').primary().notNullable();
    table.string("text");
    table.string("link");
    table.boolean("enable");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('notification');
};
