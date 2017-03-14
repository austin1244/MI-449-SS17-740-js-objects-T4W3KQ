// ----
// DATA
// ----

var adapter =  new LocalStorageDataAdapter("JOKES")

// created a joke data structure
function Joke (name, setup, punchline) {
  this.name = name
  this.setup = setup
  this.punchline = punchline
}
// joke object
var jokes = {

  local: adapter.$initResource("data"),

  // takes a Joke param
  add: function (joke) {
    // get joke object from cache or storage
    var jokesObj = this.local.data
    //add to the joke list
    jokesObj[joke.name] = {
      setup: joke.setup,
      punchline: joke.punchline
    }
    // set new joke object
    this.local.data = jokesObj
  },
  delete: function (key) {
    var jokesObj = this.local.data
    delete jokesObj[key]
    this.local.data = jokesObj
  }
}

// The message to display if the jokes object is empty
var noJokesMessage = 'I... I don\'t know any jokes. 😢'

// -------------
// PAGE UPDATERS
// -------------

// Update the listed jokes, based on the jokes object
var jokesMenuList = document.getElementById('jokes-menu')
var updateJokesMenu = function () {
  // Don't worry too much about this code for now.
  // You'll learn how to do advanced stuff like
  // this in a later lesson.
  var jokeObj = jokes.local.data
  var jokeKeys = Object.keys(jokeObj)
  var jokeKeyListItems = jokeKeys.join('</li><li>') || noJokesMessage
  jokesMenuList.innerHTML = '<li>' + jokeKeyListItems + '</li>'
}

// Update the displayed joke, based on the requested joke
var requestedJokeInput = document.getElementById('requested-joke')
var jokeBox = document.getElementById('joke-box')
var updateDisplayedJoke = function () {
  var requestedJokeKey = requestedJokeInput.value
  if (jokes.local.data.hasOwnProperty(requestedJokeKey)) {
    var joke = jokes.local.data[requestedJokeKey]
    jokeBox.innerHTML = '<p>' + joke.setup + '</p><p>' + joke.punchline + '</p>'
  } else {
    jokeBox.textContent = 'No matching joke found'
  }
}

// Function to keep track of all other
// page update functions, so that we
// can call them all at once
var updatePage = function () {
  updateJokesMenu()
  updateDisplayedJoke()
}

// -------
// STARTUP
// -------

// Update the page immediately on startup
updatePage()

// ---------------
// EVENT LISTENERS
// ---------------
// remember a joke
document.getElementById('remember-btn')
        .addEventListener('click', function () {
          // Had this seperated into two lines,
          // but I liked how it read as a one liner
          jokes.add(new Joke(
              document.getElementById('joke-about').value,
              document.getElementById('joke-setup').value,
              document.getElementById('joke-punchline').value
            )
          )
          updatePage()
        })

document.getElementById('forget-joke')
        .addEventListener('click', function () {
          jokes.delete(
            document.getElementById('forget-input').value
          )
          updatePage()
        })
// Keep the requested joke up-to-date
requestedJokeInput.addEventListener('input', updateDisplayedJoke)
