function populateResults (data) {
  
}

function getMovie (id) {
  console.log('sending data: ', id)
  fetch('/api/v1/movie?id='+ id, {
    method: 'get'
  })
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      console.log('parsed json', json)
      
      //populateResults(json.Search)
    })
    .catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

