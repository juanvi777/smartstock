let productos = JSON.parse(localStorage.getItem("productos")) || [];
let ventas = JSON.parse(localStorage.getItem("ventas")) || [];

nombreTienda.textContent = localStorage.getItem("usuarioActivo") || "Mi tienda";

// MENU
function toggleMenu(){ menu.classList.toggle("oculto"); }

function mostrarSeccion(id){
    document.querySelectorAll(".card").forEach(c=>c.classList.add("oculto"));
    document.getElementById(id).classList.remove("oculto");
}

// INVENTARIO
function mostrarFormulario(){ formProducto.classList.toggle("oculto"); }

function agregarProducto(){
    let p = {
        id: idProd.value,
        codigo: codigo.value,
        nombre: nombre.value,
        costo: parseFloat(costo.value),
        valor: parseFloat(valor.value),
        stock: 10
    };
    productos.push(p);
    guardar();
    mostrarTabla();
}

function mostrarTabla(){
    tablaProductos.innerHTML="";
    productos.forEach(p=>{
        tablaProductos.innerHTML += `
        <tr><td>${p.id}</td><td>${p.codigo}</td><td>${p.nombre}</td><td>$${p.valor}</td><td>${p.stock}</td></tr>`;
    });
}

// VENTAS
let carrito=[];

function agregarAventa(){
    let texto = buscarProducto.value;
    let cantidad = parseInt(cantidadVenta.value);

    let producto = productos.find(p =>
        p.codigo === texto || p.nombre.toLowerCase().includes(texto.toLowerCase())
    );

    if(!producto || isNaN(cantidad)){
        alert("Producto inválido");
        return;
    }

    carrito.push({nombre:producto.nombre, valor:producto.valor, cantidad, id:producto.id});
    mostrarVenta();
}

function mostrarVenta(){
    listaVenta.innerHTML="";
    let total=0;

    carrito.forEach((p,i)=>{
        total+=p.valor*p.cantidad;
        listaVenta.innerHTML+=`
        <tr>
        <td>${p.nombre}</td>
        <td>${p.cantidad}</td>
        <td>$${p.valor*p.cantidad}</td>
        <td><button onclick="eliminarItem(${i})">❌</button></td>
        </tr>`;
    });

    totalVenta.textContent="Total: $"+total;
}

function eliminarItem(i){
    carrito.splice(i,1);
    mostrarVenta();
}

// MODAL
function abrirModal(){ modalFactura.style.display="block"; }
function cerrarModal(){ modalFactura.style.display="none"; }

// FACTURA
function finalizarVenta(){
    if(carrito.length===0){ alert("No hay productos"); return; }

    let total=0;
    let detalle="";

    carrito.forEach(item=>{
        let p=productos.find(x=>x.id===item.id);
        if(p) p.stock-=item.cantidad;

        let sub=item.valor*item.cantidad;
        total+=sub;

        detalle+=`<tr><td>${item.nombre}</td><td>${item.cantidad}</td><td>$${sub}</td></tr>`;
        ventas.push(item);
    });

    guardar();

    detalleFactura.innerHTML=detalle;
    totalFactura.textContent="Total: $"+total;
    fechaFactura.textContent=new Date().toLocaleString();

    abrirModal();
    carrito=[];
    mostrarVenta();
}

// IA VOZ
function hablar(texto){
    let voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "es-ES";
    speechSynthesis.speak(voz);
}

// IA PRO
function responder(){
    let texto = pregunta.value.toLowerCase();
    if(texto==="") return;

    chatBox.innerHTML+=`<div class="mensaje usuario"><b>Tú:</b> ${texto}</div>`;

    robot.style.transform="scale(1.3)";
    setTimeout(()=>robot.style.transform="scale(1)",300);

    let escribiendo = document.createElement("div");
    escribiendo.className="mensaje ia escribiendo";
    escribiendo.innerHTML="<b>IA:</b> escribiendo";
    chatBox.appendChild(escribiendo);

    let respuesta="No entendí 🤔";

    // RESPUESTAS
    if(texto.includes("hola")){
        respuesta="Hola 😎 soy tu asistente inteligente";
    }
    else if(texto.includes("quien eres")){
        respuesta="Soy la Smart IA de tu tienda";
    }
    else if(texto.includes("ganancia")){
        let total=0;
        ventas.forEach(v=>{
            let p=productos.find(x=>x.id===v.id);
            if(p) total+=(p.valor-p.costo)*v.cantidad;
        });
        respuesta="Tu ganancia es $"+total;
    }
    else if(texto.includes("ventas hoy")){
        let hoy = new Date().toLocaleDateString();
        let total = ventas.filter(v=>v.fecha===hoy).length;
        respuesta="Hoy llevas "+total+" ventas";
    }
    else if(texto.includes("ventas")){
        respuesta="Total ventas: "+ventas.length;
    }
    else if(texto.includes("productos")){
        respuesta="Tienes "+productos.length+" productos";
    }
    else if(texto.includes("stock")){
        let bajos=productos.filter(p=>p.stock<5);
        respuesta=bajos.length===0 ? "Todo bien 👍" : "Compra: "+bajos.map(p=>p.nombre).join(", ");
    }
    else if(texto.includes("producto mas vendido")){
        let conteo = {};
        ventas.forEach(v=>{
            conteo[v.nombre]=(conteo[v.nombre]||0)+v.cantidad;
        });
        let max = Object.keys(conteo).reduce((a,b)=> conteo[a]>conteo[b]?a:b, "");
        respuesta = max ? "El más vendido es "+max : "No hay datos";
    }
    else if(texto.includes("resumen")){
        respuesta = "Ventas: "+ventas.length+" | Productos: "+productos.length;
    }

    setTimeout(()=>{
        escribiendo.remove();
        chatBox.innerHTML+=`<div class="mensaje ia"><b>IA:</b> ${respuesta}</div>`;
        hablar(respuesta);
        chatBox.scrollTop=chatBox.scrollHeight;
    },1000);

    pregunta.value="";
}

// GUARDAR
function guardar(){
    localStorage.setItem("productos", JSON.stringify(productos));
    localStorage.setItem("ventas", JSON.stringify(ventas));
}

mostrarTabla();

function cerrarSesion() {
    // Limpia datos si usas localStorage (opcional)
    localStorage.clear();

    // Redirige al inicio (login)
    window.location.href = "index.html";
}