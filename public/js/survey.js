var provider = new firebase.auth.GoogleAuthProvider();
var loggedUser;
var selectedFile;

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
function nextQuestions(){
    
    //Saves info from all the questions from the first page
    var healthProfessional = document.getElementById("healthProfessional").value;
    var gender = document.getElementById("gender").value;
   
    localStorage.setItem("healthProfessional", healthProfessional);
    localStorage.setItem("gender", gender);

    if(healthProfessional == ("Physiotherapist") || healthProfessional==("RMT") || healthProfessional==("Chiropractor")){
        //Loads all the questions for these three health professionals 
        document.location.href = "therapistQuestion.html";
        
    }
    else if(healthProfessional==("Kinesiology") || healthProfessional==("Dietitian") || healthProfessional==("Narutopath")){
        //Loads all the questions for these three health professional
        document.location.href = "exerciseQuestion.html";
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
        console.log("Missing field in form");
    }
    else{
        question1 = document.getElementById("question1").value;
        question2 = document.getElementById("question2").value;
        question3 = document.getElementById("question3").value;
        question4 = document.getElementById("question4").value;
        question5 = document.getElementById("question5").value;
        question6 = document.getElementById("question6").value;
        var gender = localStorage.getItem("gender");
        var health = localStorage.getItem("healthProfessional");

        var ref = firebase.database().ref('userHealthPreferences/'+loggedUser.uid+'/therapistHistory');

        var newPostKey = ref.push().key;

        var postData = {
            reason: question1,
            pastTreatment: question2,
            painScale: question3,
            painDescription: question4,
            seenTherapist: question5,
            previousExperience: question6,
            healthProfessional: health,
            gender: gender
        };

        //Puts values into database
        ref.child(newPostKey).set(postData);

        console.log("Preferences saved!");
        setTimeout(changePage, 3000);
    
    }
}

function healthAnswer(){
    if(document.getElementById("question2").value == "" 
    || document.getElementById("question3").value == ""
    || document.getElementById("question4").value == ""
    || document.getElementById("question5").value == ""){
        console.log("Missing field in form");
    }
    else{
    var question2 = document.getElementById("question2").value;
    var question3 = document.getElementById("question3").value;
    var question4 = document.getElementById("question4").value;
    var question5 = document.getElementById("question5").value;
    var question4part2 = document.getElementById("question4part2").value;
    var gender = localStorage.getItem("gender");
    var health = localStorage.getItem("healthProfessional");


    var postData2 = {};
    var checked = document.querySelectorAll('[name="history"]:checked');
    for(var x=0; checked.length > x; x++){ 
    postData2[checked[x].value] = true;  
}


    var ref = firebase.database().ref('userHealthPreferences/'+loggedUser.uid+'/personalHealth');

    var newPostKey = ref.push().key;

    var postData = {
        onMedication: question2,
        haveInjury: question3,
        haveSurgery: question4,
        surgeryExperience: question4part2,
        currentlyPregnant: question5,
        healthProfessional: health,
        gender: gender
    };

    ref.child(newPostKey).set(postData);
    firebase.database().ref('userHealthPreferences/'+loggedUser.uid+'/personalHealth/'+newPostKey).child('medicalHistory').set(postData2);

    console.log("Preference saved!");

    setTimeout(changePage, 2000);
}
}


function changePage(){
    document.location.href = "healthList.html";
}