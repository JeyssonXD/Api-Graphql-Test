
exports.up = function(knex, Promise) {
  var person = knex.schema.withSchema('public').createTable("person",(table)=>{
    table.increments('id').primary().notNullable();
    table.string('name');
    table.integer('age');
    table.boolean('active');
  });
  return Promise.all([person]);
};

exports.down = function(knex, Promise) {
  
};
