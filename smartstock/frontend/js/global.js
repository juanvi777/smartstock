function toggleMenu(){
document.getElementById("menu").classList.toggle("oculto");
}

function verificarSesion(){
let tienda = localStorage.getItem("tiendaActiva");
if(!tienda){
window.location.href="index.html";
}else{
document.getElementById("nombreTienda").textContent=tienda;
}
}

function cerrarSesion(){
localStorage.removeItem("tiendaActiva");
window.location.href="index.html";
}