//JavaScript doesn't get run until the HTML is finished loading
$(document).ready(function () {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBkj8wI0_sg9vYapDgxBaxoBMViG2qKkEw",
    authDomain: "codingbootcamp1234.firebaseapp.com",
    databaseURL: "https://codingbootcamp1234.firebaseio.com",
    projectId: "codingbootcamp1234",
    storageBucket: "codingbootcamp1234.appspot.com",
    messagingSenderId: "515110600061"
  };

  firebase.initializeApp(config);

  //database service reference
  var dataRef = firebase.database();

  //On click event to add train info
  $("#add-train").on("click", function (event) {
    event.preventDefault();

    //Store train info
    train = $("#train-input").val().trim();
    destination = $("#destination-input").val().trim();
    time = $("#time-input").val().trim();
    frequency = $("#frequency-input").val().trim();

    dataRef.ref().push({
      train: train,
      destination: destination,
      time: time,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  });

  //Load initialization and Firebase watcher
  dataRef.ref().on("child_added", function (childSnapshot) {
    var newTrain = childSnapshot.val().train;
    var nextDestination = childSnapshot.val().destination;
    var nextTime = childSnapshot.val().time;
    var updatedFrequency = childSnapshot.val().frequency;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(nextTime, "HH:mm").subtract(1, "years");
    // Time Difference
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // Time apart (remainder)
    var tRemainder = diffTime % updatedFrequency;
    // How many minutes until arrival
    var tMinutesTillTrain = updatedFrequency - tRemainder;
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    //Next arrival of train
    var trainArrival = moment(nextTrain).format("HH:mm");

    //Populate screen
    $("#current-train-list").append(
      "<tr><td>" + newTrain +
      "</td><td>" + nextDestination +
      "</td><td>" + updatedFrequency +
      "</td><td>" + trainArrival +
      "</td><td>" + tMinutesTillTrain +
      "<td><button class='btn btn-default btn-dark delete-train'key='" + childSnapshot.key + "'  id='delete-train'>X</button></td>" +
      "</td></tr>");

    //Delete rows
    $(".delete-train").on("click", function (event) {
      keyref = $(this).attr("key");
      dataRef.ref().child(keyref).remove();
      window.location.reload();
    });

    //Field input clear
    $("#train-input, #destination-input, #time-input, #frequency-input").val("");
    return false;

    //Error logging
  }, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
});