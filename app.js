// ----
// DATA
// ----
function validateJoke (joke) {
  Object.keys(joke)
}
function Joke (name, setup, punchline) {
  return {
    name: name,
    setup: setup,
    punchline: punchline
  }
}
// A couple jokes to start with
var jokes = {
  add: function (joke) {
    this.stored[joke.key] = {
      setup: joke.setup,
      punchline: joke.punchline
    }
  }
}
Object.defineProperty(jokes, 'stored', {
  get: function () {
    var jokes = window.localStorage.getItem('jokes')
    return jokes !== null
           ? jokes
           : {}
  },
  set: function (jokes) {
    window.localStorage.setItem('jokes', jokes)
    return jokes
  }
})

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
  var jokeKeys = Object.keys(jokes.stored)
  var jokeKeyListItems = jokeKeys.join('</li><li>') || noJokesMessage
  jokesMenuList.innerHTML = '<li>' + jokeKeyListItems + '</li>'
}

// Update the displayed joke, based on the requested joke
var requestedJokeInput = document.getElementById('requested-joke')
var jokeBox = document.getElementById('joke-box')
var updateDisplayedJoke = function () {
  var requestedJokeKey = requestedJokeInput.value
  if (requestedJokeKey in jokes.stored) {
    var joke = jokes.stored[requestedJokeKey]
    jokeBox.innerHTML = '<p>' + joke.setup + '</p><p>' + joke.punchline + '</p'
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
          var joke = new Joke(
            document.getElementById('joke-about').value,
            document.getElementById('joke-setup').value,
            document.getElementById('joke-punchline').value
          )
          jokes.add(joke)
          updateJokesMenu()
        })
// Keep the requested joke up-to-date
requestedJokeInput.addEventListener('input', updateDisplayedJoke)
