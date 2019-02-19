/* global document */
/* global window */
/* global lunr */

(() => {
  function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');

    for (let i = 0; i < vars.length; i += 1) {
      const pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
    return undefined;
  }

  const searchTerm = getQueryVariable('query');

  function displaySearchResults(results, store) {
    const searchResults = document.getElementById('search-results');

    // Are there any results?
    if (results.length) {
      // Iterate over the results
      const resultString = results.reduce((allResults, result) => {
        const item = store[result.ref];
        // eslint-disable-next-line no-param-reassign
        allResults += `<article><a href="${item.url}"><h2>${
          item.title
        }</h2></a>`;
        // eslint-disable-next-line no-param-reassign
        allResults += `<p>${item.content.substring(0, 150)}...</p></article>`;
        return allResults;
      }, '<h1>Search results</h1>');

      searchResults.innerHTML = resultString;
    } else {
      let noResultString = '';
      noResultString += '<h1>No results found!</h1>';
      noResultString += `<p><i>"${searchTerm}"</i> did not match any content. `;
      noResultString += 'Please try a different keyword.</p>';
      searchResults.innerHTML = noResultString;
    }
  }

  if (searchTerm) {
    document.getElementById('search-box').setAttribute('value', searchTerm);

    // Initalize lunr with the fields it will be searching on.
    // eslint-disable-next-line func-names
    const idx = lunr(function() {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('author');
      this.field('category');
      this.field('content');
    });

    // Add the data to lunr
    Object.keys(window.store).forEach(key => {
      idx.add({
        id: key,
        title: window.store[key].title,
        author: window.store[key].author,
        category: window.store[key].category,
        content: window.store[key].content
      });

      const results = idx.search(searchTerm);

      // Get lunr to perform a search
      displaySearchResults(results, window.store);
    });
  }
})();
