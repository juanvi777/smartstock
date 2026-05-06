function crearCuenta(){
    let user = document.getElementById("nuevoUser").value.trim();
    let pass = document.getElementById("nuevoPass").value.trim();

    if(user === "" || pass === ""){
        alert("Completa los campos");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let existe = usuarios.find(u => u.user === user);

    if(existe){
        alert("Ese usuario ya existe");
        return;
    }

    usuarios.push({user, pass});

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cuenta creada");

    // limpiar
    document.getElementById("nuevoUser").value = "";
    document.getElementById("nuevoPass").value = "";

    window.location.href = "index.html";
}

function volver(){
    window.location.href = "index.html";
}