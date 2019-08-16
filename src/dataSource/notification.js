//notification datasource

//packages
const moment = require('moment');

//import helper class
var globalResponse = require("../helper/globalResponse");

//import notification
const notification = require('../database/models/notification');
const notificationPerson = require('../database/models/notificationPerson');

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
  async createNotification({text,link,type,ForeKeys}){
    try{

      let newNotification = new notification({
        text:text,
        link:link,
        enable:true,
        fecha: moment().format('DD/MM/YYYY h:mm:ss a')
      });

      var bdNotification;

      switch(type){
        case 'person':
          bdNotification = await newNotification.customCreatePerson({idPerson:ForeKeys});
          break;
        default:
          return;
      }
      
      return this.notificationReducer(bdNotification.serialize());
    }catch(error){
      throw error;
    }
  },
  //disabled notifications
  async disabledNotification({id,type}){
    try{
        //validation exist
        var search;

        switch(type){
          case 'person':
            search = await notificationPerson.where({idPerson:id}).fetch(); 
            break;
          default:
            //nothing
            break;
        }

        if(search==null) return globalResponse("CODE4001",true,"Notification not found",'notification',null);

        var notificationWork = await notification.where({id:search.serialize().idNotification}).fetch();

        notificationWork.set('enable',false);
        var dataSaveChange = await notificationWork.save();
        return globalResponse("CODE4000",true,"Notification disabled correctly",'notification',this.notificationReducer(dataSaveChange.serialize()));
    }catch(error){
      throw error;
    }
  }
};

module.exports =  notificationDataSource;