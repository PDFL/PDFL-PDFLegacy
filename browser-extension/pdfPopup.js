function generateOpenWithPDFLButton() {
  var btn = document.createElement("button");
  var t = document.createTextNode("Open in PDF - Legacy");
  btn.appendChild(t);
  btn.style.zIndex = 100;
  btn.style.top = "15px";
  btn.style.left = "15px";
  btn.style.position = "absolute";

  btn.addEventListener("click", () => {
    let url = location.href;
    location.href = `localhost:8080/?url=${url}`;
  });
  document.body.appendChild(btn);
}

let url = location.href;
if (url.includes(".pdf") && !url.includes("pdfl")) {
  generateOpenWithPDFLButton();
}
