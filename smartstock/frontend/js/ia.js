function responder(){
    let texto = document.getElementById("pregunta").value.toLowerCase();
    let chat = document.getElementById("chatBox");

    chat.innerHTML += `<p><b>Tú:</b> ${texto}</p>`;

    let respuesta = "Analiza tus ventas 📊";

    if(texto.includes("ganancia")){
        respuesta = "Revisa inventario y costos para calcular ganancias";
    }

    chat.innerHTML += `<p><b>IA:</b> ${respuesta}</p>`;
}