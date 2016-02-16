var userForm = document.querySelector('#userSearch')
var currentListId = userForm.elements['listAlias'].value

function userSearchResults (data) {
  var container = document.querySelector('.user__search__results')
  container.innerHTML = ''
  console.log('results: ', data)
  data.forEach(function (ele, idx) {
    var resultObject = document.createElement('div')
    resultObject.classList.add('search__result')
    var posterImg = document.createElement('i')
    posterImg.classList.add('fa')
    posterImg.classList.add('fa-user')

    posterImg.classList.add('search__result--figure')
    
    var searchDetails = document.createElement('div')
    searchDetails.classList.add('search__result--details')
    var titleText = document.createElement('h6')
    titleText.classList.add('search__result--text')
    if (ele.twitter) {
      titleText.textContent = '@' + ele.twitter.username
    } else {
      titleText.textContent = ele.google.name
    }
    
    
    searchDetails.appendChild(titleText)
    if (currentListId) {
      var addToList = document.createElement('a')
      addToList.setAttribute('href', '/lists/'
        + currentListId.value
        + '/user/add/'
        + ele._id)
      addToList.textContent = 'Add To Current List'
      
      searchDetails.appendChild(addToList)
    }
    
    resultObject.appendChild(posterImg)
    resultObject.appendChild(searchDetails)
    
    container.appendChild(resultObject)
    
    //console.log('ele, idx:', ele, idx)
  })
}

function userSearch (name) {
  console.log('sending data: ', name)
  fetch('/api/v1/users/search?name='+ name, {
    method: 'get'
  })
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      // console.log('parsed json', json)
      
      userSearchResults(json.users)
    })
    .catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

userForm.addEventListener('submit', function (e) {
  e.preventDefault()
  var name = userForm.elements['userInput'].value
  userSearch(name)
})
var userSearchTimeout
userForm.addEventListener('input', function (e) {
  e.preventDefault()
  if (userSearchTimeout) {
    clearTimeout(userSearchTimeout)
  }
  userSearchTimeout = setTimeout(function() {
    var name = userForm.elements['userInput'].value
    if (name.length > 1) {
      userSearch(name)
    }
  }, 100)
})