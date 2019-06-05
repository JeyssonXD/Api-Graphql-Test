
exports.up = function(knex, Promise) {
    return  knex.schema.withSchema('public').table("userRole",(table)=>{
        table.increments('id').primary().notNullable();
      });
};

exports.down = function(knex, Promise) {
  
};
