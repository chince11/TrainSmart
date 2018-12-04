var mainApp = {};
var email;
var password;
var loggedUser;

$(document).ready(function(){
   
    var uid = null;
    firebase.auth().onAuthStateChanged(function(user) {
        if(user){
            // User is signed in
            loggedUser = user;

            var ref = firebase.database().ref('user/').child(loggedUser.uid);
   
            ref.on("value", function(snap){   
                if(!snap.exists()){
                    firebase.database().ref('user/' + loggedUser.uid).set({
                    name: loggedUser.displayName,
                    email: loggedUser.email,
                    uid: loggedUser.uid,
                    accountType: "Client"
                     });
                     console.log("Welcome for the first time " + loggedUser.displayName + "!");
                }
            });         
            console.log('User is logged in @ ' + loggedUser.email);
        }
        else{
            //rediect to login page
            uid = null;
            console.log('User does not exist');
            window.location.replace("index.html")
        }
    });
    
    
    function logOut(){
        firebase.auth().signOut();
        console.log('user is logged out');
    }

    mainApp.logOut = logOut;
    });

    function profilePage(){
        window.location.href("profile.html")
    }


