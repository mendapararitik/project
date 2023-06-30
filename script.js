var loadingDiv = document.getElementById("loadingDiv")
    
// Get the input field
var input = document.getElementById("queryText");

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    submitButton.click();
  }
});

function sendVote(responseName, vote){

  // Get data from session storage
  let result = sessionStorage.getItem("result");

  result = JSON.parse(result)

  // console.log(responseName)

  // Update Google Sheets
  updateGoogleSheets(result, vote, responseName)

  // Reveal voting buttons
  // votingDiv.style.display = "none"

}

function populateContent(result){

  result = JSON.parse(result)

  var responseBox = document.getElementById("responseDiv")

  // Clear innerHTML of responseBox
  responseBox.innerHTML = ""

  var innerHTML = ''

  // Get all responses and populate HTML
  for (const key in result){

    console.log(`${key}: ${result[key]}`);

    resultArray = result[key]

    var title = resultArray[0]
    var link = resultArray[1]
    var context = resultArray[2]
    var score = resultArray[3]

    innerHTML += `<h2><a href=${link} target="_blank">${title}</a></h2><button id="goodVote" onclick="sendVote('${key}','good')" class="btn btn-primary m-1">👍</button><button id="badVote" onclick="sendVote('${key}','bad')" class="btn btn-danger m-1">👎</button>
                  <p><b>Context:</b> ${context}</p>
                  <p><b>Score:</b> ${score}</p>
                  <br>
                  `
  }

  // Make loading div disappear
  loadingDiv.style.display = "none"

  // Repopulate responseBox
  responseBox.innerHTML = innerHTML
  
  // Store result in session storage
  sessionStorage.setItem("result", JSON.stringify(result));

  // Update Google Sheets
  updateGoogleSheets(result, "none", "none")

  // Reveal voting buttons
  // votingDiv.style.display = "block"
}

function updateGoogleSheets(result, vote, choice){

  let queryString = document.getElementById("queryText").value

  // Google Sheets API
  let url = "https://script.google.com/macros/s/AKfycbwTmL2r1sUl08MLYKcYueKjY8ElyI5kZqWRjaEQqCBI-W4A2R5he-kYrn-96P_PQW3H/exec"

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded")

  var raw = JSON.stringify({
    "question": queryString,
    "response1": result['response 1'],
    "response2": result['response 2'],
    "response3": result['response 3'],
    "response4": result['response 4'],
    "response5": result['response 5'],
    "vote": vote,
    "choice": choice
    })

    console.log(raw)

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    mode: 'no-cors',
    body: raw,
    redirect: 'follow'
  };

  fetch(url, requestOptions)
    .then(response => response.text())
    // .then(result => responseBox.innerHTML = result)
    .then(result => console.log(`Sent to Google Sheets\n${result}`))
    .catch(error => console.log('error', error));
}

function sendData(){

  loadingDiv.style.display = "block"

  var responseBox = document.getElementById("responseDiv")
  responseBox.innerHTML = ""

  let url = "https://crcifb.deta.dev/query/"

  let queryString = document.getElementById("queryText").value

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "query_string": queryString,
    "num_responses": 5
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(url, requestOptions)
    .then(response => response.text())
    // .then(result => responseBox.innerHTML = result)
    .then(result => populateContent(result))
    .catch(error => console.log('error', error));
      }