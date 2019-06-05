
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('public').table('user',function(table){
    table.string('password').notNullable();
  });
};

exports.down = function(knex, Promise) {
  
};
