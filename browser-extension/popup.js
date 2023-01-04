var btn = document.getElementById("btn");

/**
 * Callback for querying the current tab. Redirect to PDFL reader.
 *
 * @param {Tabs[]} tabs
 */
function callback(tabs) {
  var currentTab = tabs[0];
  chrome.tabs.update({
    url: "https://pdfl-pdf-legacy.onrender.com/?url=" + currentTab.url,
  });
  window.close();
}

/**
 * Redirects to PDFL reader when a user click the 'open' button.
 */
btn.addEventListener("click", () => {
  var query = { active: true, currentWindow: true };

  chrome.tabs.query(query, callback);
});
