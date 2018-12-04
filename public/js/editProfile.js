var provider = new firebase.auth.GoogleAuthProvider();
var loggedUser;
var selectedFile;

$(document).ready(function() {
    signIn();
    $("#uploadButton").hide();
    $(".upload-group").hide();
    
});

function loadEditFields(){

    var ref = firebase.database().ref('user/'+loggedUser.uid);
    ref.on("value", function(snap){
        var age = snap.child("age").val();
        var account = snap.child("accountType").val();
        var bio = snap.child("bio").val();
        var name = snap.child("name").val();
        var gender = snap.child("gender").val();
        //var city = snap.child("city").val();

        document.getElementById("profile_name").innerHTML = name;
        document.getElementById("name").value = name;
        document.getElementById("account").value = account;
        document.getElementById("age").value =  age;
        document.getElementById("bio").value =  bio;
        document.getElementById("gender").value =  gender;
    });
}

function signIn(){
    var uid = null;
    firebase.auth().onAuthStateChanged(function(user) {
        if(user){
            // User is signed in
            loggedUser = user;
            loadProfilePic();
            loadEditFields();
        }
        else{
            //rediect to login page
            uid = null;
            console.log('User does not exist');
            window.location.replace("index.html")
        }
    });
};

function loadProfilePic(){
    $(".upload-group").show();
    //Gets Iamge Name from Database
    var ref = firebase.database().ref('user/'+ loggedUser.uid +'/imgURL');
  
    ref.on("value", function(snap) {
        
        if(snap.val() != null) {
            //Puts the downloaded image as their profile picture
            var img = document.getElementById('profile_pic');
            img.src = snap.val();

        }
    })
}

//Gets the file name and shows the upload button
function selectfile(event){
    selectedFile = $('#file').get(0).files[0];
    $("#uploadButton").show();
}


function updateProfile() {
    var account = document.getElementById("account");
    var age = document.getElementById("age");
    var bio = document.getElementById("bio");
    var name = document.getElementById("name");
    var gender = document.getElementById("gender");

    if(bio == null || bio.value == "" && name == null || name == ""){
        console.log("Missing Field Values");
    }{
        firebase.database().ref('user/'+loggedUser.uid+'/name').set(name.value);
        firebase.database().ref('user/'+loggedUser.uid+'/bio').set(bio.value);
        firebase.database().ref('user/'+loggedUser.uid+'/age').set(age.value);
        firebase.database().ref('user/'+loggedUser.uid+'/accountType').set(account.value);
        firebase.database().ref('user/'+loggedUser.uid+'/gender').set(gender.value);

        console.log("Info Updated!");
        document.location.href = 'profile.html';
    }
}

function logOut(){
    firebase.auth().signOut();
    console.log('User logged out');
  }
