var provider = new firebase.auth.GoogleAuthProvider();
var loggedUser;
var searchedUser;
var selectedFile;
var userID;

$(document).ready(function() {
    $("#uploadButton").hide();
    $(".upload-group").hide();

    document.getElementById('username').addEventListener("keydown",function(e){
        if(e.keyCode == 13){
            document.getElementById("searchBtn").click();
        } 
      });
});

function search(){
    
    searchedUser = document.getElementById("username").value;
    
    var ref = firebase.database().ref('user/');
    
    ref.once('value', function(snapshot){
        snapshot.forEach(function(snap){
            //Searches for user based on their displayName (first or last name)
           // window.alert(JSON.stringify(snap.child('name')));
             if(snap.child('name').val().toLowerCase().includes(searchedUser.toLowerCase())){

                //Puts searched user ID in localstorage
                userID = snap.child('name').val();
                localStorage.setItem("userID",userID);

                //Goes go profile page
                window.location.replace('profile.html');
             }
             else{
                 console.log('no user found');
             }
        })
    })
}

function logOut(){
    firebase.auth().signOut();
    console.log('User logged out');
  }
