function toggleMenu(){
    document.getElementById("menu").classList.toggle("oculto");
}

function verificarSesion(){
    let usuario = localStorage.getItem("usuarioActivo");

    if(!usuario){
        window.location.href = "index.html";
    } else {
        let nombre = document.getElementById("nombreTienda");
        if(nombre){
            nombre.textContent = usuario;
        }
    }
}

function cerrarSesion(){
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
}