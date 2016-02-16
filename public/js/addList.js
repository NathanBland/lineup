var form = document.querySelector('#addList')

function addList (title) {
  console.log('sending data: ', title)
  fetch('/api/v1/list/add', {
    method: 'post',
    body: new FormData(form)
  })
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      console.log('parsed json', json)
    })
    .catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

form.addEventListener('submit', function (e) {
  e.preventDefault()
  var title = form.elements['listTitle'].value
  addList(title)
})
