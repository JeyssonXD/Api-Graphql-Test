//notification datasource

//packages
const moment = require('moment');

//import helper class
var globalResponse = require("../helper/globalResponse");

//import notification
const notification = require('../database/models/notification');

const notificationDataSource = {
  //reducer for mapping
  notificationReducer(notification){
    return {
      id: notification.id,
      text: notification.text,
      link: notification.link,
      enable: notification.enable,
      fecha: notification.fecha
    }
  },
  //get notifications enable true
   async getNotifications(){
    try{
      var notifications = await notification.where({enable:true}).fetchAll();
      return notifications.serialize()!=null?notifications.serialize().map(notification=>this.notificationReducer(notification)):[];
    }catch(error){
      throw error;
    }
  },
  //create notification
  async createNotification({text,link}){
    try{

      let newNotification = new notification({
        text:text,
        link:link,
        enable:true,
        fecha: moment().format('DD/MM/YYYY h:mm:ss')
      });

      var bdNotification = await newNotification.save();
      return this.notificationReducer(bdNotification.serialize());
    }catch(error){
      throw error;
    }
  },
  //disabled notifications
  async disabledNotification({id}){
    try{
        var notification = await notification.where({id:id}).fetch();
        notification.set('enable',false);
        var dataSaveChange = await notification.save();
        return globalResponse("CODE4000",true,"Notification disabled correctly",'notification',notificationReducer(dataSaveChange.serialize()));
    }catch(error){
      throw error;
    }
  }
};

module.exports =  notificationDataSource;