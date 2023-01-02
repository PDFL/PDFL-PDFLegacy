var btn = document.getElementById("btn");

function callback(tabs) {
  var currentTab = tabs[0];
  chrome.tabs.update({ url: "http://localhost:8080?url=" + currentTab.url });
  window.close();
}

btn.addEventListener("click", () => {
  var query = { active: true, currentWindow: true };

  chrome.tabs.query(query, callback);
});
