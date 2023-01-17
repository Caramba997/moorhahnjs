class API {
  constructor() {
    this.url = 'http://localhost:3000';
    this.version = 'v0.0';
    this.routes = {
      getHighscores: '/api/highscores',
      setHighscore: '/api/highscores'
    };
  }

  /**
   * Do a GET request to the API
   * @param {String} endpoint A valid endpoint from API.routes
   * @param {Function} onSuccess A callback function for success with one parameter that holds the JSON result
   * @param {Function} onError A callback function for error with one parameter that holds the error
   * @returns undefined
   */
  async get(endpoint, onSuccess, onError) {
    const route = this.routes[endpoint];
    if (!route) {
      console.error('[API] Post: Unknown endpoint');
      return null;
    }
    fetch(this.url + route, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Origin': location.origin
      }
    })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then((result) => {
      if (onSuccess) onSuccess(result);
    })
    .catch((err) => {
      if (onError) onError(err);
    });
  }

  /**
   * Do a POST request to the API
   * @param {String} endpoint A valid endpoint from API.routes
   * @param {Function} onSuccess A callback function for success with one parameter that holds the JSON result
   * @param {Function} onError A callback function for error with one parameter that holds the error
   * @returns undefined
   */
  async post(endpoint, data, onSuccess, onError) {
    const route = this.routes[endpoint];
    if (!route) {
      console.error('[API] Post: Unknown endpoint');
      return null;
    }
    fetch(this.url + route, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Origin': location.origin,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then((result) => {
      if (onSuccess) onSuccess(result);
    })
    .catch((err) => {
      if (onError) onError(err);
    });
  }
}

window.api = new API();