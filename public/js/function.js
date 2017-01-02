var _uid = null;

$("#GOOGLE_LOGIN").click(function() {
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase .auth().signInWithPopup(provider).then(function(result) {
    alert("Login Success");
    $("#m_signIn").modal('close');
  }).catch(function(error) {
    alert(error.message);
  });
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    _uid = user.uid;
    $("#AUTH_STATE").show();
    $("#AUTH_STATE").text(user.displayName + "님 로그인 하셨습니다.");
    $("#MY_INFO").show();
    $("#LOGIN").hide();
    $("#LOGOUT").show(); // Show LogOut Button

    //RealTime User State
    firebase.database().ref('/onUsers/' + user.uid).set({"username": user.displayName, "siteOn": 1});
    firebase.database().ref('/onUsers/').on('value', function(snapshot_users) {

    });

    // Show User Info
    $("#USER_NAME").text(user.displayName);
    $("#USER_MAIL").text(user.email);
    $("#USER_UID").text(user.uid);
    $("#USER_PHOTO").attr('src', user.photoURL);
    $("#USER_INFO").show();

    // Change siteOn state to 0 when disconnect DB
    firebase.databse().ref("/onUsers/" + user.uid + "/siteOn").onDisconnect().set(0);
  } else {
    $("#LOGIN").show();
    $("#LOGOUT").hide(); //Hide LogOut Button
    $("#AUTH_STATE").hide();
    $("#MY_INFO").hide();
    _uid = null;
  }
});

$("#LOGOUT").click(function() {
  firebase.database().ref('/onUsers/').off();

  firebase.database().ref("/onUsers/" + _uid + "/siteOn").set(0);

  firebase.auth().signOut().then(function() {
    alert("인증이 해제되었습니다.");
  }, function(error) {
    alert(error.message);
  });
});

$("#BTN_SIGNUP").click(function() {
  var signup_mail = $("#INPUT_EMAIL").val();
  var signup_password = $("#INPUT_PASSWORD").val();
  var signup_password_confirm = $("#INPUT_PASSWORD_CONFIRM").val();
  var signup_name = $("#INPUT_NAME").val();

  if (signup_password != signup_password_confirm) {
    alert("Check Password!");
  } else {
    firebase.auth().createUserWithEmailAndPassword(signup_mail, signup_password).then(function() {
      var user = firebase.auth().currentUser;

      user.updateProfile({
        'displayName': signup_name,
        'photoURL': "/images/profile.png"
      }).then(function() {
        alert("Success SignUp");
        location.reload();
      }, function(error) {
        console.log(error);
        alert(error.message);
      });
    }).catch(function(error) {
      alert(error.message);
    });
  }
});

$("#BTN_SIGNIN").click(function() {
  var signin_mail = $("#SIGNIN_EMAIL").val();
  var signin_password = $("#SIGNIN_PASSWORD").val();

  firebase.auth().signInWithEmailAndPassword(signin_mail, signin_password).then(function() {
    $("#m_signIn").modal('close');
  }).catch(function(error) {
    alert(error.message);
  });
});

$(window).on("beforeunload", function() {
  if(_uid != null) {
    firebase.database().ref('/onUsers/' + _uid + 'siteOn').set(0);
  }
});
