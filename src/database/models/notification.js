//bookshelf js
const config = require('../config/config');
var bookshelf = require('bookshelf')(config);
bookshelf.plugin('registry');
var cascadeDelete = require('bookshelf-cascade-delete');
bookshelf.plugin(cascadeDelete);


const notification = bookshelf.Model.extend({
  tableName: 'notification',
  //constructor
  constructor: function(){
      bookshelf.Model.apply(this,arguments);
  }
}
);

module.exports = bookshelf.model('notification',notification);