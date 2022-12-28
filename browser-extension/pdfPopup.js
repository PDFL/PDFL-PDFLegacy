/**
 * Generates the injected HTML showing two buttons,
 * one for opening the pdf in PDFL reader and
 * one for closing this popup.
 */
function generateOpenWithPDFLButton() {
  var popup = document.createElement("div");
  popup.setAttribute("id", "injected-popup");

  var btn = document.createElement("button");
  btn.setAttribute("id", "injected-button");
  var t = document.createTextNode("Open in PDF - Legacy");
  btn.appendChild(t);

  var noBtn = document.createElement("button");
  noBtn.setAttribute("id", "injected-button-no");
  t = document.createTextNode("Close");
  noBtn.appendChild(t);

  btn.addEventListener("click", () => {
    let url = location.href;
    location.href = `http://localhost:8080/?url=${url}`;
  });
  noBtn.addEventListener("click", () => {
    popup.remove();
  });

  popup.appendChild(btn);
  popup.append(noBtn);
  document.body.appendChild(popup);
}

let url = location.href;
// if pdf is open inject the DOM with popup window
if (url.endsWith(".pdf") && !url.includes("pdfl")) {
  generateOpenWithPDFLButton();
}
