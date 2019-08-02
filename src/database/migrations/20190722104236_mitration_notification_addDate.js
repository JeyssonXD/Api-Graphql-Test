
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('public').table('notification',function(table){
    table.datetime("fecha");
  });
};

exports.down = function(knex, Promise) {
  
};
