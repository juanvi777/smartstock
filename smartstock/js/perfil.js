function cambiarLogo(event){

    let file = event.target.files[0];

    if(!file){
        alert("Selecciona una imagen");
        return;
    }

    let reader = new FileReader();

    reader.onload = function(e){

        // 🔥 GUARDAMOS SOLO EL LOGO OFICIAL
        localStorage.setItem("logoTienda", e.target.result);

        alert("Logo actualizado ✅");

        location.reload();
    };

    reader.readAsDataURL(file);
}