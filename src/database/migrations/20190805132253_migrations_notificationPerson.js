
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('public').createTable('notificationPerson',(table)=>{
    table.increments("id").primary().notNullable();
    table.integer('idPerson').references('person.id');
    table.integer('idNotification').references('notification.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('notificationPerson');
};
