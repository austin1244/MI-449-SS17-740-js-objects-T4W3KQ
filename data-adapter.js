var LocalStorageDataAdapter = function (appId) {
  var self = this

  // ----------------
  // SET UP THE CACHE
  // ----------------

  // Initialize the cache on the adapter instance. This is used instead
  // of a local variable to make any future debugging easier. I'm using
  // Object.defineProperty so that it cannot be overwritten and will not
  // be enumerable, meaning it won't be included in iterated keys or in
  // JSON.stringify output.
  var cacheProperty = privatizeProperty('cache')
  Object.defineProperty(self, cacheProperty, {
    value: {},
    writable: true
  })
  var cache = {}

  // -----------------
  // RESOURCE HANDLING
  // -----------------

  Object.defineProperty(self, '$initResource', {

    value: function (resourceName) {
      // Use a scoped resource name, to avoid conflicts with any other
      // items in localStorage, which is more likely if this is a
      // library used in more than just a single app.
      var privateResourceName = privatizeProperty(resourceName)

      // Define getters and setters for the resource that invisibly
      // fetch from and update localStorage.
      Object.defineProperty(self, resourceName, {
        get: function () {

          return cache[resourceName] || getResourceFromLocalStorage()
        },
        set: function (newData) {
          var stringifiedResource = JSON.stringify(newData)
          window.localStorage.setItem(privateResourceName, stringifiedResource)
        },
        // Set the resource to enumerable, so that it IS included in
        // iterated keys or in JSON.stringify output.
        enumerable: true
      })

      // Return the resource that was just initialized, fetching data
      // from localStorage for the first time.
      return self

      // -------
      // HELPERS
      // -------

      // Get a resource from localStorage, defining mutation methods
      // and making it difficult to modify the object in a that does
      // not update localStorage.
      function getResourceFromLocalStorage () {
        // Fetch the resource from localStorage, with the assumption
        // that it will either be a valid object or null. When null,
        // default to an empty object.
        var rawResource = window.localStorage.getItem(privateResourceName)
        var resource = JSON.parse(rawResource) || {}
        // Define the $set and $delete methods for the resource, to
        // add, update, and remove individual properties.
        defineMutationMethods(resource)
        // Parse and redefine every property on the resource, making
        // it difficult for them to be modified in a way that does
        // not update localStorage.
        for (var key in resource) {
          defineResourceProperty(resource, key, resource[key])
        }
        // Cache and return the fully processed resource.
        cache[resourceName] = resource
        return resource
      }

      // Define methods to add and remove properties.
      function defineMutationMethods (resource) {
        // Define the $set method, to add or update properties
        // on the resource.
        Object.defineProperty(resource, '$set', {
          value: function (property, value) {
            defineResourceProperty(resource, property, value)
            self[resourceName] = resource
          }
        })
        // Define the $delete method, to remove properties from
        // the resource.
        Object.defineProperty(resource, '$delete', {
          value: function (property) {
            delete resource[property]
            self[resourceName] = resource
          }
        })
      }

      // Define a new property on a resource, recursively freezing
      // its value if it's an object.
      function defineResourceProperty (resource, property, value) {
        Object.defineProperty(resource, property, {
          value: freezeRecursively(value),
          enumerable: true,
          // Make resource properties configurable, so that we can
          // go through and freeze each object in the tree, if the
          // value is an object.
          configurable: true
        })
      }
    }
  })

  // -------
  // HELPERS
  // -------
  /**
   * Seems like there were always potential problems with
   * every solution acording to stackoverflow users.
   * The most stable I could put together from what I read was:
   * ES5 --> Array.isArray
   * underscore.js --> obj === Object(obj)
   *
   */
  function isObject (obj) {

    return obj === Object(obj) && !Array.isArray(obj)
  }
  // Scoping for private properties and localStorage keys.
  function privatizeProperty (property) {
    return '__$DATA_ADAPTER$__' + appId + '__' + property + '__'
  }

  // Freezes an entire tree of objects, making it impossible
  // to add, remove, or update properties.
  function freezeRecursively (possibleObject) {
    if (typeof possibleObject !== 'object') {
      return possibleObject
    }
    Object.freeze(possibleObject)
    for (var key in possibleObject) {
      var value = possibleObject[key]
      freezeRecursively(value)
    }
    return possibleObject
  }
}
