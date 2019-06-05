const globalResponse = (code,success,message,objectName,object) =>{
    var reponse = {};
    response = {
        code:code,
        success:success,
        message:message
    }
    response[objectName] = object;
    return response;
}

module.exports = globalResponse;
