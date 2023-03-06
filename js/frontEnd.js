var modal = document.getElementById("wrapper-1")
var modalContent = document.getElementById("popup1")
var closeButton = document.getElementById("toggleClose")
var btn = document.getElementById("toggle")
btn.onclick = function(){
    modal.style.display = "block";
}
window.onclick = function (event) {
if (event.target == modalContent || event.target == closeButton) {
    modal.style.display = "none";
}
}