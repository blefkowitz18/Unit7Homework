function Application() {
    let self = this
  
    let config = {
        apiKey: "AIzaSyD-JgMTtP9LkVjowDJQHukp07Ap-derfK4",
        authDomain: "trainschedule-1919b.firebaseapp.com",
        databaseURL: "https://trainschedule-1919b.firebaseio.com",
        projectId: "trainschedule-1919b",
        storageBucket: "trainschedule-1919b.appspot.com",
        messagingSenderId: "781540824548"
    };
    firebase.initializeApp(config);
    let database = firebase.database()
  
    this.storeData = function () {
      let name = $('#nameInput').val().trim()
      let destination = $('#destinationInput').val().trim()
      let firstTrainInput = $('#firstTrainInput').val().trim()
      let frequency = $('#frequencyInput').val().trim()
  
      // Store to firebase
      database.ref().push({
        name: name,
        destination: destination,
        firstTrain: firstTrainInput,
        frequency: frequency,
        minutesAway: firebase.database.ServerValue.TIMESTAMP
      })
    }

    this.trainToTable = function (empData) {
        let nextArrival = Math.max(moment().diff(empData.firstTrain, "nextArrival"), frequency)
        let minutesAway = Math.max(moment().diff(empData.minutesAway, "minutesAway"), nextArrival)
        var tabr = $("<tr>"),
          tabd1 = $("<td>"),
          tabd2 = $("<td>"),
          tabd3 = $("<td>"),
          tabd4 = $("<td>"),
          tabd5 = $("<td>");
        tabd1.text(empData.name);
        tabd2.text(empData.destination);
        tabd3.text(empData.frequency);
        tabd4.text(nextArrival);
        tabd5.text(minutesAway);
        tabr.append(tabd1, tabd2, tabd3, tabd4, tabd5);
        $("#tableData").append(tabr);
      };
    
      $('#addTrain').on('click', function (event) {
        event.preventDefault()
        self.storeData()
        $('#nameInput').val("")
        $('#destinationInput').val("")
        $('#firstTrainInput').val("")
        $('#frequencyInput').val("")
      })

    database.ref().once("value").then(function (snapshot) {
        $('#tableData').empty()
        snapshot.forEach(function (childSnapshot) {
          var childData = childSnapshot.val();
          self.trainToTable(childData)
        });
      })
    
      // This function allows you to update your page in real-time when the firebase database changes.
      database.ref().orderByChild('dateAdded').limitToLast(1).on('child_added', function (snapshot) {
    
        let childData = snapshot.val()
        self.trainToTable(childData)
    
        // If any errors are experienced, log them to console.
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    
}