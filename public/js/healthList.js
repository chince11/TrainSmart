var provider = new firebase.auth.GoogleAuthProvider();
var loggedUser;
var selectedFile;
var hProfession;
var hGender;

$(document).ready(function() {
    signIn();
    $("#uploadButton").hide();
    $(".upload-group").hide();
    
});

function signIn(){
    var uid = null;
    firebase.auth().onAuthStateChanged(function(user) {
        if(user){
            // User is signed in
            loggedUser = user;
            loadHealthProfessionalList();
        }
        else{
            //rediect to login page
            uid = null;
            console.log('User does not exist');
            window.location.replace("index.html")
        }
    });
};
function logOut(){
    firebase.auth().signOut();
    console.log('User logged out');
  }

function loadHealthProfessionalList(){

    //Get Preferences
    var ref = firebase.database().ref('userHealthPreferences/' + loggedUser.uid + '/therapistHistory');
    loadList(ref);
    var ref3 = firebase.database().ref('userHealthPreferences/' + loggedUser.uid + '/personalHealth');
    loadList(ref3);
}
function loadList(ref){
    var likes;
    var dislikes;
    var accolades;
  
    var table = document.getElementById("table");

    ref.on('value', function(snapshot){
        snapshot.forEach(function(snap){
    var ref2 = firebase.database().ref('user/');
   
    ref2.on('value', function(snapshot){
        hProfession = snap.child('healthProfessional').val();
        hGender = snap.child('gender').val();
        snapshot.forEach(function(snap){
            
             if(snap.child('profession').val() == hProfession && snap.child('gender').val() == hGender && hProfession != null){
                var hEmail = snap.child("email").val();
                var hName = snap.child("name").val(); 
                
        
        if (hName != "" && hEmail != ""){
            

            //Finds duplicates in table
            var tdlength= $("td").filter(function() {
                return $(this).text().toLowerCase() == hEmail ;//get td with item_x 
             }).length;

             if(!tdlength){
                
                    var row = table.insertRow(-1);

                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
            
                    cell1.innerHTML = hName;
                    cell2.innerHTML = hProfession;
                    cell3.innerHTML = hEmail;
             }
             else{
                 console.log("Duplicate found");
             }

        }
        else{
            console.log("no profile info");
        }
             }
             else{
                 console.log('no user found');
             }
        })
    })
        })
    })
    localStorage.clear();
}


function nextQuestions(){
    
    //Saves info from all the questions from the first page
    var healthProfessional = document.getElementById("healthProfessional").value;
    var gender = document.getElementById("gender").value;
   
    localStorage.setItem("healthProfessional", healthProfessional);
    localStorage.setItem("gender", gender);

    if(healthProfessional == ("Physio") || healthProfessional==("RMT") || healthProfessional==("Chiro")){
        //Loads all the questions for these three health professionals 
        document.location.href = "therapistQuestion.html";
        
    }
    else if(healthProfessional==("Kinesiology") || healthProfessional==("Dietitian") || healthProfessional==("Narutopath")){
        //Loads all the questions for these three health professional
        document.location.href = "healthQuestion.html";
    }
  }

  function therapistAnswer(){

    var question1 = document.getElementById("question1");
    var question2 = document.getElementById("question2");
    var question3 = document.getElementById("question3");
    var question4 = document.getElementById("question4");
    var question5 = document.getElementById("question5");
    var question6 = document.getElementById("question6");


    if(document.getElementById("question1").value == "" || document.getElementById("question2").value == "" 
    || document.getElementById("question3").value == ""
    || document.getElementById("question4").value == ""
    || document.getElementById("question5").value == "" 
    || document.getElementById("question6").value == ""){
        console.log("Missing field in form")
    }
    else{
        question1 = document.getElementById("question1").value;
        question2 = document.getElementById("question2").value;
        question3 = document.getElementById("question3").value;
        question4 = document.getElementById("question4").value;
        question5 = document.getElementById("question5").value;
        question6 = document.getElementById("question6").value;
        var gender = localStorage.getItem("gender");
        var health = localStorage.getItem("healthProfessional")

        var ref = firebase.database().ref('userHealthPreferences/').child(loggedUser.uid);

        var newPostKey = ref.push().key;

        firebase.database().ref('userHealthPreferences/'+loggedUser.uid+"/"+ newPostKey +'/reason').set(question1);
        firebase.database().ref('userHealthPreferences/'+loggedUser.uid+"/"+ newPostKey +'/pastTreatment').set(question2);
        firebase.database().ref('userHealthPreferences/'+loggedUser.uid+"/"+ newPostKey +'/painScale').set(question3);
        firebase.database().ref('userHealthPreferences/'+loggedUser.uid+"/"+ newPostKey +'/painDescription').set(question4);
        firebase.database().ref('userHealthPreferences/'+loggedUser.uid+"/"+ newPostKey +'/seenTherapist').set(question5);
        firebase.database().ref('userHealthPreferences/'+loggedUser.uid+"/"+ newPostKey +'/previousExperience').set(question6);
        firebase.database().ref('userHealthPreferences/'+loggedUser.uid+"/"+ newPostKey +'/gender').set(gender);
        firebase.database().ref('userHealthPreferences/'+loggedUser.uid+"/"+ newPostKey +'/healthProfessional').set(health);
        firebase.database().ref('userHealthPreferences/'+loggedUser.uid+"/"+ newPostKey +'/clientName').set(loggedUser.displayName);
        
        console.log("Preferences saved!");
 
    }
}
