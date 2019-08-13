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
  },
  //custom create
  customCreatePerson: function(attributes){
    return this
      .save()
      .tap(c=>this.related('notificationPerson').create(attributes))
  },
  //relationship
  notificationPerson: function(){
    return this.hasMany(require('./notificationPerson'),'idNotification');
  }
}
);

module.exports = bookshelf.model('notification',notification);