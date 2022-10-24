(function(){
    //Place the canvas 25pc bottom the top bar
    let headerHigh = window.getComputedStyle(document.getElementById('header')).height.replace('px', '');
    document.getElementById("canvas").style.paddingTop = (Number(headerHigh)+25)+'px';
    console.log(headerHigh);
})();