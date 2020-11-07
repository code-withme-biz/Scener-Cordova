
var notifications = {

        init: function() {
            console.log('request notifications permissions');

            /*
            cordova.plugins.firebase.messaging.requestPermission().then(function() {
                console.log("Push messaging is allowed");
            });
            cordova.plugins.firebase.messaging.getToken().then(function(token) {
                console.log("Got device token: ", token);
            });

            cordova.plugins.firebase.messaging.onMessage(function(payload) {
                console.log("New foreground FCM message: ", payload);
            });

            cordova.plugins.firebase.messaging.onBackgroundMessage(function(payload) {
                console.log("New background FCM message: ", payload);
            });
            */
        },

 }

 export default notifications;


