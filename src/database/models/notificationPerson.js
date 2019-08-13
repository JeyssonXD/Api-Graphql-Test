//bookshelf js
const config = require('../config/config');
var bookshelf = require('bookshelf')(config);
bookshelf.plugin('registry');
var cascadeDelete = require('bookshelf-cascade-delete');
bookshelf.plugin(cascadeDelete);


const notificationPerson = bookshelf.Model.extend({
  tableName: 'notificationPerson',
  //constructor
  constructor: function(){
      bookshelf.Model.apply(this,arguments);
  },
  //relationship
  person: function(){
    return this.belongsTo(require('./person'),"idPerson");
  },
  //relationship
  notification: function(){
    return this.belongsTo(require('./notification'),"idNotification");
  }
}
);

module.exports = bookshelf.model('notificationPerson',notificationPerson);