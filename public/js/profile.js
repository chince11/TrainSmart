var provider = new firebase.auth.GoogleAuthProvider();
var loggedUser;
var selectedFile;
var userID=localStorage.getItem("userID");

$(document).ready(function() {
    signIn();
    $("#uploadButton").hide();
    $(".upload-group").hide();
});

function signIn() {
    var uid = null;
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            // User is signed in
            loggedUser = user;

            //loads current user if searched ID is the same
            if(userID == loggedUser.uid || userID == null) {
                loadProfile();        
            }

            //Loads searched user if ID's are different
            else if (userID != loggedUser.uid)  {
                loadSearchedProfile();
            }
        }
        else  {
            window.location.replace("index.html")
            console.log('User not logged in.');
        }
    });
};
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#imagePreview').css('background-image', 'url('+e.target.result +')');
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#imageUpload").change(function() {
    readURL(this);
});
//load currentUser's profile information
function loadProfile() {

    loadProfilePic();
    document.getElementById("profile_name").innerHTML = loggedUser.displayName;

    var ref = firebase.database().ref('user/'+loggedUser.uid);
    ref.on("value", function(snap){
        var age = snap.child("age").val();
        var account = snap.child("accountType").val();
        var bio = snap.child("bio").val();
        var name = snap.child("name").val();

        
        if (age == null && account == null && bio == null && name != null){
            document.getElementById("profile_name").innerHTML = name;
            document.getElementById("account").innerHTML = "";
            document.getElementById("bio").innerHTML = "";
        }
        else if(age == null || age == "" && account != null && bio != null && name != null){
            document.getElementById("profile_name").innerHTML = name;
            document.getElementById("account").innerHTML = account;
            document.getElementById("bio").innerHTML = "<strong>Bio: </strong><br><p>"+ bio +"</p>";
            document.getElementById("age").innerHTML = "";
        }
        else if(age != null){
            document.getElementById("profile_name").innerHTML = name;
            document.getElementById("account").innerHTML = account;
            document.getElementById("age").innerHTML =    "<strong>Age: </strong><br> <p>"+ age +"</p>";
            document.getElementById("bio").innerHTML = "<strong>Bio: </strong><br><p>"+ bio +"</p>";
        }
        else{
            console.log("no profile info");
        }
    });
}
function loadSearchedProfile(){
    document.getElementById("editProfile").style.display = "none";
    document.getElementById("profile_name").innerHTML = userID;
    loadSearchedProfilePic();


    var ref = firebase.database().ref('user/');

    ref.once('value', function(snapshot){
        snapshot.forEach(function(snap){
             if(snap.child('name').val().toLowerCase().includes(userID.toLowerCase())){

                var age = snap.child("age").val();
                var account = snap.child("accountType").val();
                var bio = snap.child("bio").val();
                var name = snap.child("name").val();

        if(account == "Client"){
        if (age == null && account == null && bio == null && name != null){
            document.getElementById("profile_name").innerHTML = name;
            document.getElementById("account").innerHTML = "";
            document.getElementById("bio").innerHTML = "";
        }
        else if(age == null || age == "" && account != null && bio != null && name != null){
            document.getElementById("profile_name").innerHTML = name;
            document.getElementById("account").innerHTML = account;
            document.getElementById("bio").innerHTML = "<strong>Bio: </strong><br><p>"+ bio +"</p>";
            document.getElementById("age").innerHTML = "";
        }
        else if(age != null){
            document.getElementById("profile_name").innerHTML = name;
            document.getElementById("account").innerHTML = account;
            document.getElementById("age").innerHTML =    "<strong>Age: </strong><br> <p>"+ age +"</p>";
            document.getElementById("bio").innerHTML = "<strong>Bio: </strong><br><p>"+ bio +"</p>";
        }
        else{
            console.log("no profile info");
        }
    }
    else if (account == "Health Professional"){
        var profession = snap.child("profession").val();

        if (age == null && account == null && bio == null && name != null){
            document.getElementById("profession").innerHTML = profession;
            document.getElementById("profile_name").innerHTML = name;
            document.getElementById("account").innerHTML = "";
            document.getElementById("bio").innerHTML = "";
        }
        else if(age == null || age == "" && account != null && bio != null && name != null){
            document.getElementById("profession").innerHTML = profession;
            document.getElementById("profile_name").innerHTML = name;
            document.getElementById("account").innerHTML = "Profession:";
            document.getElementById("bio").innerHTML = "<strong>Bio: </strong><br><p>"+ bio +"</p>";
            document.getElementById("age").innerHTML = "";
        }
        else if(age != null){
            document.getElementById("profession").innerHTML =profession;
            document.getElementById("profile_name").innerHTML = name;
            document.getElementById("account").innerHTML = "Profession:";
            document.getElementById("age").innerHTML =    "<strong>Age: </strong><br> <p>"+ age +"</p>";
            document.getElementById("bio").innerHTML = "<strong>Bio: </strong><br><p>"+ bio +"</p>";
            
        }
        else{
            console.log("no profile info");
        }
    }
    
             }
             else{
                 console.log('no user found');
             }
        })
    })
    localStorage.clear();
}
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
            else{
            var img = document.getElementById('profile_pic');
            img.src = "https://firebasestorage.googleapis.com/v0/b/rvbmxtsw-8f5e5.appspot.com/o/img%2FuserProfilePictures%2FdefaultPic.png?alt=media&token=2576565f-7654-4278-b00f-ad3657675772";
        }   
    });
}
function loadSearchedProfilePic(){
    $(".upload-group").hide();
    //Gets Iamge Name from Database
    var ref = firebase.database().ref('user/');
    
        ref.once("value", function(snapshot) {
            snapshot.forEach(function(snap){
            if(snap.child('imgURL').val() != null && snap.child('name').val().toLowerCase().includes(userID.toLowerCase())){
                var img = document.getElementById('profile_pic');
                img.src = snap.child('imgURL').val();
                return true;
            }
            else if (snap.child('imgURL').val() == null){
                var img = document.getElementById('profile_pic');
                img.src = "https://firebasestorage.googleapis.com/v0/b/rvbmxtsw-8f5e5.appspot.com/o/img%2FuserProfilePictures%2FdefaultPic.png?alt=media&token=2576565f-7654-4278-b00f-ad3657675772";
            }
    });
    })
}

//Gets the file name and shows the upload button
function selectfile(event){
    selectedFile = $('#file').get(0).files[0];
    $("#uploadButton").show();
}

function uploadFile(){
    //Create a refernce to User's Image File
    var fileName = selectedFile.name;

    //Create a root reference
    var storageRef = firebase.storage().ref('/img/userProfilePictures/' + fileName);

    //uploads File
    var uploadTask = storageRef.put(selectedFile);


    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', function(snapshot){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
    }, function(error) {
        // Handle unsuccessful uploads
        console.log("Upload failed.");
    }, function() {
      //var imageKey = firebase.database().ref().child('ProfilePics').push().key;

        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
    
        //Puts into database
        firebase.database().ref('user/'+loggedUser.uid+'/imgURL').set(downloadURL);
        console.log('File available at', downloadURL);
        console.log('File successfully uploaded.');
        });
    });
}

function clearPreferences(){
    var ref = firebase.database().ref('userHealthPreferences/').child(loggedUser.uid);

    var newPostKey = ref.push().key;

    var updates = {};

    var postData = {
    };

    //Puts values into database
    ref.set(postData);

    console.log("Preferences Cleared!");
}


function logOut(){
    firebase.auth().signOut();
    console.log('User logged out');
  }
