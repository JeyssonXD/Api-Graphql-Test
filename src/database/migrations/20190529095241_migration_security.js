
exports.up = function(knex, Promise) {
    return knex.schema.createTable('user', function(table) {
        table.increments('id').primary();
        table.string('email');
        table.boolean('active');
        table.string('description');
      }).createTable('role', function(table) {
        table.increments('id').primary();
        table.string('name');
        table.string('description');
      }).createTable('userRole', function(table) {
        table.integer('idUser').unsigned().references('user.id');
        table.integer('idRole').unsigned().references('role.id');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('userRole')
    .dropTable('user')
    .dropTable('id');
};
