class Notification{
    constructor(receiverId, message, timeStamp){
        this.receiverId = receiverId;
        this.message=message;
        this.timeStamp=timeStamp;
    }


    sendNotification(){
        console.log(`Notification send to Student ${this.receiverId}: "${this.message}" at ${this.timeStamp}`);
    }
}

module.exports = Notification;