var form = document.querySelector('#search')

function populateResults (data) {
  var container = document.querySelector('.search__results')
  container.innerHTML = ''
  console.log('results: ', data)
  data.forEach(function (ele, idx) {
    var resultObject = document.createElement('div')
    resultObject.classList.add('search__result')
    
    var posterImg = document.createElement('img')
    posterImg.classList.add('search__result--figure')
    posterImg.setAttribute('src', ele.Poster)
    
    var searchDetails = document.createElement('div')
    searchDetails.classList.add('search__result--details')
    
    var titleText = document.createElement('h4')
    titleText.classList.add('search__result--text')
    titleText.textContent = ele.Title + ' (' + ele.Year + ')'
    
    var link = document.createElement('a')
    link.setAttribute('href', '/movie/'+ele.imdbID)
    
    searchDetails.appendChild(titleText)
    
    resultObject.appendChild(posterImg)
    resultObject.appendChild(searchDetails)
    link.appendChild(resultObject)
    
    container.appendChild(link)
    
    //console.log('ele, idx:', ele, idx)
  })
}

function searchTitle (title) {
  console.log('sending data: ', title)
  fetch('/api/v1/search?title='+ title, {
    method: 'get'
  })
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      // console.log('parsed json', json)
      
      populateResults(json.Search)
    })
    .catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

form.addEventListener('submit', function (e) {
  e.preventDefault()
  var title = form.elements['title'].value
  searchTitle(title)
})
var searchTimeout
form.addEventListener('input', function (e) {
  e.preventDefault()
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(function() {
    var title = form.elements['title'].value
    if (title.length > 1) {
      searchTitle(title)
    }
  }, 100)
})