let productos = JSON.parse(localStorage.getItem("productos")) || [];
let ventas = JSON.parse(localStorage.getItem("ventas")) || [];

// 🔥 SESIÓN
let usuario = localStorage.getItem("usuarioActivo");
let nombre = document.getElementById("nombreTienda");

if(!usuario){
    window.location.href = "index.html";
} else {
    if(nombre){
        nombre.textContent = usuario;
    }
}

// MENU
function toggleMenu(){
    document.getElementById("menu").classList.toggle("oculto");
}

function mostrarSeccion(id){
    document.querySelectorAll(".card").forEach(c=>c.classList.add("oculto"));
    document.getElementById(id).classList.remove("oculto");
}

// INVENTARIO
function mostrarFormulario(){
    document.getElementById("formProducto").classList.toggle("oculto");
}

function agregarProducto(){
    let p = {
        id: document.getElementById("idProd").value,
        codigo: document.getElementById("codigo").value,
        nombre: document.getElementById("nombre").value,
        costo: parseFloat(document.getElementById("costo").value) || 0,
        valor: parseFloat(document.getElementById("valor").value),
        stock: 10
    };

    productos.push(p);
    guardar();
    mostrarTabla();
}

function mostrarTabla(){
    let tabla = document.getElementById("tablaProductos");
    tabla.innerHTML="";

    productos.forEach(p=>{
        tabla.innerHTML += `
        <tr>
        <td>${p.id}</td>
        <td>${p.codigo}</td>
        <td>${p.nombre}</td>
        <td>$${p.valor}</td>
        <td>${p.stock}</td>
        </tr>`;
    });
}

// VENTAS
let carrito=[];

function agregarAventa(){
    let texto = document.getElementById("buscarProducto").value;
    let cantidad = parseInt(document.getElementById("cantidadVenta").value);

    let producto = productos.find(p =>
        p.codigo === texto || p.nombre.toLowerCase().includes(texto.toLowerCase())
    );

    if(!producto || isNaN(cantidad)){
        alert("Producto inválido");
        return;
    }

    carrito.push({
        nombre: producto.nombre,
        valor: producto.valor,
        cantidad,
        id: producto.id
    });

    mostrarVenta();
}

function mostrarVenta(){
    let lista = document.getElementById("listaVenta");
    let totalTexto = document.getElementById("totalVenta");

    lista.innerHTML="";
    let total=0;

    carrito.forEach((p,i)=>{
        total+=p.valor*p.cantidad;
        lista.innerHTML+=`
        <tr>
        <td>${p.nombre}</td>
        <td>${p.cantidad}</td>
        <td>$${p.valor*p.cantidad}</td>
        <td><button onclick="eliminarItem(${i})">❌</button></td>
        </tr>`;
    });

    totalTexto.textContent="Total: $"+total;
}

function eliminarItem(i){
    carrito.splice(i,1);
    mostrarVenta();
}

// MODAL
function abrirModal(){ document.getElementById("modalFactura").style.display="block"; }
function cerrarModal(){ document.getElementById("modalFactura").style.display="none"; }

// FINALIZAR VENTA
function finalizarVenta(){
    if(carrito.length===0){
        alert("No hay productos");
        return;
    }

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

    document.getElementById("detalleFactura").innerHTML=detalle;
    document.getElementById("totalFactura").textContent="Total: $"+total;
    document.getElementById("fechaFactura").textContent=new Date().toLocaleString();

    abrirModal();
    carrito=[];
    mostrarVenta();
}

// IA SIMPLE
function responder(){
    let texto = document.getElementById("pregunta").value.toLowerCase();
    let chat = document.getElementById("chatBox");

    chat.innerHTML+=`<div><b>Tú:</b> ${texto}</div>`;

    let respuesta="No entendí";

    if(texto.includes("ventas")){
        respuesta="Total ventas: "+ventas.length;
    }

    chat.innerHTML+=`<div><b>IA:</b> ${respuesta}</div>`;
}

// GUARDAR
function guardar(){
    localStorage.setItem("productos", JSON.stringify(productos));
    localStorage.setItem("ventas", JSON.stringify(ventas));
}

mostrarTabla();