
exports.up = function(knex, Promise) {
    var order = knex.schema.withSchema('public').createTable("order",(table)=>{
        table.increments('id').primary().notNullable();
        table.integer('idPerson').references('person.id');
        table.string('observation');
        table.enu('type',['CANCELLED','APPROVED']);
      });
      return Promise.all([order]);
};

exports.down = function(knex, Promise) {
  
};
