function irCrear(){
    limpiarInputs();
    window.location.href = "crear.html";
}

function irRecuperar(){
    limpiarInputs();
    window.location.href = "recuperar.html";
}

function obtenerUsuarios(){
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function login(){
    let user = document.getElementById("usuario").value.trim();
    let pass = document.getElementById("password").value.trim();

    if(user === "" || pass === ""){
        alert("Completa los campos");
        return;
    }

    let usuarios = obtenerUsuarios();

    let existe = usuarios.find(u => u.user === user && u.pass === pass);

    if(existe){
        localStorage.setItem("usuarioActivo", user);

        limpiarInputs();

        window.location.href = "dashboard.html";
    } else {
        alert("Usuario o contraseña incorrectos");
        document.getElementById("password").value = "";
    }
}

/* 🔥 LIMPIAR TODO */
function limpiarInputs(){
    let user = document.getElementById("usuario");
    let pass = document.getElementById("password");

    if(user) user.value = "";
    if(pass) pass.value = "";
}

/* 🔥 AL RECARGAR */
window.onload = limpiarInputs;

/* 🔥 AL SALIR DE LA PÁGINA */
window.onbeforeunload = limpiarInputs;