(function() {

	function getText() {
		var wrapper = document.querySelector('#plots .content ul')
		if (wrapper) {
			return wrapper.innerHTML.replace(/<[^>]*>/g, '')
		} else {
			return false
		}
	}

	function getId() {
		var urlParts = window.location.href.split('/')
		var i = 0
		for (; i < urlParts.length; i++) {
			if (urlParts[i] === 'film') {
				i++;
				break;
			}
		}
		if (i >= urlParts.length) {
			return false
		} else {
			return urlParts[i]
		}
	}

	function getRating() {
		var wrapper = document.querySelector('#my-rating .content .my-rating')
		if (wrapper && !wrapper.classList.contains('not-found')) {
			var starsCount = wrapper.querySelectorAll('img.rating').length
			return starsCount * 20
		} else {
			return false
		}
	}

	function likeness(textA, textB) {
		// @TODO
		return 1/Math.abs(textA.length - textB.length)
	}

	function getPrediction(text, movies) {
		var ratings = {}
		var total = {
			rating: 0,
			weight: 0
		}
		for (var key in movies) {
			ratings[movies[key].rating] = likeness(text, movies[key].text)
		}
		for (var key in ratings) {
			total.rating += ratings[key] * key
			total.weight += ratings[key]
		}
		if (total.weight > 0) {
			total.rating = total.rating / total.weight
		}
		return total.rating
	}



	var id = getId()
	var text = getText()
	var rating = getRating()

	if (id && text) {
		chrome.storage.local.get(['movies'], function(result) {
			var movies = result.movies ? result.movies : {}

			if (rating) {
				// Save rating
				movies[id] = {
					text: text,
					rating: rating
				}
				chrome.storage.local.set({movies: movies})
			} else {
				// Predict rating
				console.log('I predict '+getPrediction(text, movies)+' %')
			}

		})
	}

})()