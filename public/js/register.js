 $(document).ready(function() {

var health = 200;
var strength = 5;
var defense = 5;
var xp = 15;

$("#remainingXp").text("You have " + xp + " xp points to build your character");
$("#defenseCount").text(defense);
$("#healthCount").text(health);
$("#strengthCount").text(strength);


$(document).on("click", "#addHealth", function() {
    health += 10;
    xp -= 1
    $("#healthCount").text(health);
    if (xp === 0) {
      $('#termsModal').modal('open');
      $("#statsSelect").hide();
    }
  $("#remainingXp").text("You have " + xp + " xp points to build your character")

});

$(document).on("click", "#addStrength", function() {
    strength += 1;
    xp -= 1
    $("#strengthCount").text(strength);
    if (xp === 0) {
      $('#termsModal').modal('open');
      $("#statsSelect").hide();
    }
  $("#remainingXp").text("You have " + xp + " xp points to build your character")

});

$(document).on("click", "#addDefense", function() {
    defense += 1;
    xp -= 1
    $("#defenseCount").text(defense);
    if (xp === 0) {
      $('#termsModal').modal('open');
      $("#statsSelect").hide();
    }
  $("#remainingXp").text("You have " + xp + " xp points to build your character")

});

  // Adding an event listener for when the form is submitted
  $("#registerUser").on('click', handleFormSubmit);

  // A function for handling what happens when the form to create a new user
  function handleFormSubmit(event) {

    var money = 500;
    var level = 1;
  
    var health = parseInt(document.getElementById("healthCount").innerHTML);
    var strength = parseInt(document.getElementById("strengthCount").innerHTML);
    var defense = parseInt(document.getElementById("defenseCount").innerHTML);

    var email = $("#registerEmail").val().trim();
    var password = $("#registerPassword").val().trim();
    var username = $("#username").val();
    var streetCredit = 0;

    event.preventDefault();
    // Don't submit unless the form is complete
    if (!password || !email) {
      return;
    }
    // Constructing a newMessage
    var newUser = {
      email: email,
      password: password,
      username: username,
      health: health,
      defense: defense,
      strength: strength,
      money: money,
      level: level,
      streetCredit: streetCredit,
      

    }; // submit the new user 
    submitToApi(newUser);

    // empty out the input fields

    $("#registerEmail").val("")
    $("#registerPassword").val("")
    $("#username").val("");



  }

  // function submitToApi(user) {
  //   console.log("about to create user");
  //   $.post("/api/users", user, function(data, err) {

  //     console.log(JSON.stringify(data));
  //     console.log(JSON.stringify(err));
  //     if (err != "success") {
  //       console.log(err)
  //     }
  //     else {

  //       window.location.href = '/login';
  //     }
  //     // If there's an error, handle it by throwing up an alert
  //   }).catch(handleErr);
  // }
  
  
  function submitToApi(user) {
   
  $.ajax({
            method: "POST",
            url: "/api/users/",
            data: user
  }).done(function(data){
    let userId = data.id;
    let weapon = {
                name: ".22",
                value: "1",
                quantity: 1,
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4TIR9nMSzRL5_WR1XTv0HgNSeZnjK95vEC-yoQtGyteoI7csArg" ,
                type: "gun",
                gameUserId: userId
            };
     $.post("/api/weapons", weapon, function() {
           console.log("weapon created")
        }).done(function() {
          window.location.href='login';
        })
  })
      
  }

 
  // function to handle errors
  function handleErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }

  // login button up in nav
  $("#loginNav").on("click", function(event) {
    event.preventDefault();
    // go to the profile
    window.location.href = '/login';
  });


});
