/* jshint -W117 */
/* jshint -W098 */
/* jshint -W070 */

(function () {
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  var searchTerm = getQueryVariable('query');

  function displaySearchResults(results, store) {
    var searchResults = document.getElementById('search-results');

    // Are there any results?
    if (results.length) {
      var resultString = '<h1>Search results</h1>';

      // Iterate over the results
      for (var i = 0; i < results.length; i++) {
        var item = store[results[i].ref];
        resultString += '<article><a href="' + item.url + '"><h2>' + item.title + '</h2></a>';
        resultString += '<p>' + item.content.substring(0, 150) + '...</p></article>';
      }

      searchResults.innerHTML = resultString;
    } else {
      var noResultString = '';
      noResultString += '<h1>No results found!</h1>';
      noResultString += '<p><i>"' + searchTerm + '"</i> did not match any content. ';
      noResultString += 'Please try a different keyword.</p>';
      searchResults.innerHTML = noResultString;
    }
  }

  if (searchTerm) {
    document.getElementById('search-box').setAttribute('value', searchTerm);

    // Initalize lunr with the fields it will be searching on.
    var idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('author');
      this.field('category');
      this.field('content');
    });

    // Add the data to lunr
    for (var key in window.store) {
      if (window.store.hasOwnProperty(key)) {
        idx.add({
          id: key,
          title: window.store[key].title,
          author: window.store[key].author,
          category: window.store[key].category,
          content: window.store[key].content,
        });

        var results = idx.search(searchTerm);

        // Get lunr to perform a search
        displaySearchResults(results, window.store);
      }
    }
  }
}());
