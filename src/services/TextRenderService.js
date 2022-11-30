/**
 * Function to hide links during the text selection
 */
async function hideLinks () {
    var textSel = window.getSelection();
    var links = document.getElementsByClassName('linkAnnotation');

    if (textSel == 0) {
        for (let i = 0; i <= links.length - 1; i++) {
            links[i].style.display = "block";
        }
    } else {
        for (let i = 0; i <= links.length - 1; i++) {
            links[i].style.display = "none";
        }
    }
}



export { hideLinks };