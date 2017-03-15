// -----
// DATA
// -----

// created a joke data structure
function Joke (name, setup, punchline) {
  this.name = name
  this.setup = setup
  this.punchline = punchline
}
// joke object
var jokes = {
  // takes a Joke param
  add: function (joke) {
    var jokesObj = this.stored
    jokesObj[joke.name] = {
      setup: joke.setup,
      punchline: joke.punchline
    }
    this.stored = jokesObj
  },
  delete: function (key) {
    var jokesObj = this.stored
    delete jokesObj[key]
    this.stored = jokesObj
  }
}
// defined a new property to load and store jokes
Object.defineProperty(jokes, 'stored', {
  get: function () {
    var jokes = JSON.parse(window.localStorage.getItem('jokes'))
    if (typeof jokes !== 'object') {
      jokes = {}
    }
    return jokes
  },
  set: function (jokes) {
    window.localStorage.setItem('jokes', JSON.stringify(jokes))
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
  var jokeObj = jokes.stored
  var jokeKeys = Object.keys(jokeObj)
  var jokeKeyListItems = jokeKeys.join('</li><li>') || noJokesMessage
  jokesMenuList.innerHTML = '<li>' + jokeKeyListItems + '</li>'
}

// Update the displayed joke, based on the requested joke
var requestedJokeInput = document.getElementById('requested-joke')
var jokeBox = document.getElementById('joke-box')
var updateDisplayedJoke = function () {
  var requestedJokeKey = requestedJokeInput.value
  if (jokes.stored.hasOwnProperty(requestedJokeKey)) {
    var joke = jokes.stored[requestedJokeKey]
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
