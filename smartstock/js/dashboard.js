let tipoNegocio =
localStorage.getItem("tipoNegocio");

let productoTemporal = null;
let productos = JSON.parse(localStorage.getItem("productos")) || [];
let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
let carrito = [];

// =========================
// SESIÓN
// =========================
let usuario = localStorage.getItem("usuarioActivo");
let nombre = document.getElementById("nombreTienda");

if (!usuario) {
    window.location.href = "index.html";
} else {
    if (nombre) {
        nombre.textContent = "SMART STOCK | " + usuario;
    }
}
if(tipoNegocio === "bar"){

    document.body.classList.add("tema-bar");

}

if(tipoNegocio === "drogueria"){

    document.body.classList.add("tema-drogueria");

}

if(tipoNegocio === "supermercado"){

    document.body.classList.add("tema-super");

}
// =========================
// MENU
// =========================
function toggleMenu() {

    let menu = document.getElementById("menu");

    menu.classList.toggle("oculto");
}

function mostrarSeccion(id) {

    document.querySelectorAll(".card").forEach(seccion => {

        seccion.classList.add("oculto");

    });

    let seccion = document.getElementById(id);

    if (seccion) {

        seccion.classList.remove("oculto");

    }

    document.getElementById("menu").classList.add("oculto");

    if (id === "historial") {

        mostrarHistorial();

    }
}

function cerrarSesion() {

    localStorage.removeItem("usuarioActivo");

    window.location.href = "index.html";
}

// =========================
// FORMATO PESO
// =========================
function formatoPeso(numero) {

    return "$" + Number(numero).toLocaleString("es-CO");

}

// =========================
// INVENTARIO
// =========================
function mostrarFormulario() {

    let form = document.getElementById("formProducto");

    form.classList.toggle("oculto");
}

function limpiarFormulario() {

    document.getElementById("idProd").value = "";
    document.getElementById("codigo").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("costo").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("cantidad").value = "";
}

function agregarProducto() {

    let id = document.getElementById("idProd").value.trim();

    let codigo = document.getElementById("codigo").value.trim();

    let nombre = document.getElementById("nombre").value.trim();

    let costo = parseFloat(
        document.getElementById("costo").value.replace(/\./g, "")
    ) || 0;

    let valor = parseFloat(
        document.getElementById("valor").value.replace(/\./g, "")
    ) || 0;

    let cantidad = parseInt(
        document.getElementById("cantidad").value
    ) || 0;

    if (
        !id ||
        !codigo ||
        !nombre ||
        !valor ||
        !cantidad
    ) {

        alert("Completa todos los campos");

        return;
    }

    // BUSCAR PRODUCTO EXACTAMENTE IGUAL
    let existente = productos.find(p =>

        p.id === id &&
        p.codigo === codigo &&
        p.nombre.toLowerCase() === nombre.toLowerCase()

    );

    // SI EXISTE EL MISMO
    if (existente) {

        let opcion = confirm(

            "Este producto ya existe.\n\n" +
            "Aceptar = SUMAR cantidad al stock.\n" +
            "Cancelar = Modificar información."

        );

        // SUMAR STOCK
        if (opcion) {

            existente.stock += cantidad;

            guardar();

            mostrarTabla();

            limpiarFormulario();

            alert("Stock actualizado correctamente");

            return;

        } else {

            document.getElementById("idProd").value = existente.id;
            document.getElementById("codigo").value = existente.codigo;
            document.getElementById("nombre").value = existente.nombre;
            document.getElementById("costo").value = existente.costo;
            document.getElementById("valor").value = existente.valor;
            document.getElementById("cantidad").value = existente.stock;

            return;
        }
    }

    // VALIDAR REPETIDOS
    let repetidoID = productos.find(p =>
        p.id === id
    );

    if (repetidoID) {

        alert(
            "ERROR:\n\n" +
            "El ID ya pertenece al producto:\n" +
            repetidoID.nombre
        );

        return;
    }

    let repetidoCodigo = productos.find(p =>
        p.codigo === codigo
    );

    if (repetidoCodigo) {

        alert(
            "ERROR:\n\n" +
            "El código de barras ya pertenece al producto:\n" +
            repetidoCodigo.nombre
        );

        return;
    }

    let nuevoProducto = {

        id,
        codigo,
        nombre,
        costo,
        valor,
        stock: cantidad

    };

    productos.push(nuevoProducto);

    guardar();

    mostrarTabla();

    limpiarFormulario();

    alert("Producto agregado correctamente");
}

function mostrarTabla() {

    let tabla = document.getElementById("tablaProductos");

    if (!tabla) return;

    tabla.innerHTML = "";

    productos.forEach((p, index) => {

        tabla.innerHTML += `
        <tr>

            <td>${p.id}</td>

            <td>${p.codigo}</td>

            <td>${p.nombre}</td>

            <td>${formatoPeso(p.costo)}</td>

            <td>${formatoPeso(p.valor)}</td>

            <td>${p.stock}</td>

            <td>

                <button 
                class="btn-editar"
                onclick="editarProducto(${index})">
                ✏️
                </button>

                <button 
                class="btn-eliminar"
                onclick="eliminarProducto(${index})">
                🗑️
                </button>

            </td>

        </tr>
        `;
    });
}

function editarProducto(index) {

    let producto = productos[index];

    document.getElementById("idProd").value = producto.id;

    document.getElementById("codigo").value = producto.codigo;

    document.getElementById("nombre").value = producto.nombre;

    document.getElementById("costo").value = producto.costo;

    document.getElementById("valor").value = producto.valor;

    document.getElementById("cantidad").value = producto.stock;

    productos.splice(index, 1);

    guardar();

    mostrarTabla();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function eliminarProducto(index) {

    let confirmar = confirm(
        "¿Eliminar producto?"
    );

    if (!confirmar) return;

    productos.splice(index, 1);

    guardar();

    mostrarTabla();
}

// =========================
// VENTAS
// =========================
function abrirBusquedaManual() {

    document.getElementById("modalBusqueda").style.display = "block";
}

function cerrarBusquedaManual() {

    document.getElementById("modalBusqueda").style.display = "none";
}

function buscarProductoManual() {

    let tipo = document.getElementById("tipoBusqueda").value;

    let texto = document.getElementById("textoBusqueda").value.toLowerCase();

    let resultado = document.getElementById("resultadoBusqueda");

    resultado.innerHTML = "";

    let encontrados = [];

    if (tipo === "nombre") {

        encontrados = productos.filter(p =>

            p.nombre.toLowerCase().includes(texto)

        );

    } else {

        encontrados = productos.filter(p =>

            p.id.toLowerCase().includes(texto)

        );
    }

    if (encontrados.length === 0) {

        resultado.innerHTML = `
        <p>No se encontraron productos</p>
        `;

        return;
    }

    encontrados.forEach(p => {

        resultado.innerHTML += `

        <div class="producto-encontrado">

            <div>

                <strong>${p.nombre}</strong><br>

                ID: ${p.id}<br>

                Código: ${p.codigo}<br>

                Precio: ${formatoPeso(p.valor)}<br>

                Stock: ${p.stock}

            </div>

            <button onclick="agregarProductoManual('${p.id}')">
                Agregar
            </button>

        </div>

        `;
    });
}

function agregarProductoManual(id) {

    let producto = productos.find(p => p.id === id);

    if (!producto) {

        alert("Producto no encontrado");

        return;
    }

    if (producto.stock <= 0) {

        alert("No hay stock disponible");

        return;
    }

    carrito.push({

        id: producto.id,
        codigo: producto.codigo,
        nombre: producto.nombre,
        cantidad: 1,
        valor: producto.valor

    });

    mostrarVenta();

    cerrarBusquedaManual();

    alert("Producto agregado");
}

function agregarPorCodigoBarras(){

    let codigo = document
    .getElementById("buscarProducto")
    .value;

    let cantidad = parseInt(
        document.getElementById("cantidadVenta").value
    ) || 1;

    let producto = productos.find(
        p => p.codigo === codigo
    );

    if(!producto){

        alert("Producto no encontrado");

        return;
    }

    carrito.push({

        id: producto.id,
        codigo: producto.codigo,
        nombre: producto.nombre,
        cantidad,
        valor: producto.valor

    });

    mostrarVenta();

    document.getElementById("buscarProducto").value = "";

    document.getElementById("cantidadVenta").value = 1;

    document.getElementById("buscarProducto").focus();
}

function mostrarVenta() {

    let lista = document.getElementById("listaVenta");

    let totalTexto = document.getElementById("totalVenta");

    lista.innerHTML = "";

    let total = 0;

    carrito.forEach((p, i) => {

        let subtotal = p.valor * p.cantidad;

        total += subtotal;

        lista.innerHTML += `

        <tr>

            <td>${p.id}</td>

            <td>${p.codigo}</td>

            <td>${p.nombre}</td>

            <td>${p.cantidad}</td>

            <td>${formatoPeso(subtotal)}</td>

            <td>
                <button onclick="eliminarItem(${i})">
                    ❌
                </button>
            </td>

        </tr>

        `;
    });

    totalTexto.textContent =
        "TOTAL: " + formatoPeso(total);
}

function eliminarItem(i) {

    carrito.splice(i, 1);

    mostrarVenta();
}

// =========================
// FACTURA
// =========================
function abrirModal() {

    document.getElementById("modalFactura").style.display = "block";
}

function cerrarModal() {

    document.getElementById("modalFactura").style.display = "none";
}

// =========================
// FINALIZAR VENTA
// =========================
function finalizarVenta() {

    if (carrito.length === 0) {

        alert("No hay productos");

        return;
    }

    let total = 0;

    let detalle = "";

    let fecha = new Date();

    carrito.forEach(item => {

        let producto = productos.find(p =>

            p.id === item.id

        );

        if (producto) {

            producto.stock -= item.cantidad;
        }

        let subtotal = item.valor * item.cantidad;

        total += subtotal;

        detalle += `

        <tr>

            <td>${item.nombre}</td>

            <td>${item.cantidad}</td>

            <td>${formatoPeso(subtotal)}</td>

        </tr>

        `;
    });

    let ventaCompleta = {

        fecha: fecha.toLocaleDateString(),

        hora: fecha.toLocaleTimeString(),

        total,

        productos: carrito

    };

    ventas.push(ventaCompleta);

    guardar();

    document.getElementById("detalleFactura").innerHTML = detalle;

    document.getElementById("totalFactura").textContent =
        "TOTAL PAGADO: " + formatoPeso(total);

    document.getElementById("fechaFactura").textContent =
        fecha.toLocaleString();

    abrirModal();

    carrito = [];

    mostrarVenta();

    mostrarTabla();
}

// =========================
// HISTORIAL
// =========================
function mostrarHistorial() {

    let contenedor = document.getElementById("historialVentas");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (ventas.length === 0) {

        contenedor.innerHTML = `
        <p>No existen ventas registradas</p>
        `;

        return;
    }

    [...ventas].reverse().forEach(v => {

        contenedor.innerHTML += `

        <div class="venta-historial">

            <div class="venta-top">

                <h3>Venta registrada</h3>

                <span>
                    ${v.fecha} - ${v.hora}
                </span>

            </div>

            <p>
                <strong>Total:</strong> 
                ${formatoPeso(v.total)}
            </p>

            <table class="tabla-venta">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Código</th>

                        <th>Producto</th>

                        <th>Cantidad</th>

                    </tr>

                </thead>

                <tbody>

                    ${v.productos.map(p => `

                    <tr>

                        <td>${p.id}</td>

                        <td>${p.codigo}</td>

                        <td>${p.nombre}</td>

                        <td>${p.cantidad}</td>

                    </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>

        `;
    });
}

// =========================
// SMART IA
// =========================
function responder() {

    let texto = document.getElementById("pregunta").value.toLowerCase();

    let chat = document.getElementById("chatBox");

    if (!texto) return;

    chat.innerHTML += `

    <div class="mensaje usuario">

        <b>TÚ:</b> ${texto}

    </div>

    `;

    let respuesta = "No entendí tu pregunta.";

    if (texto.includes("ventas")) {

        respuesta =
            "Actualmente existen " +
            ventas.length +
            " ventas registradas.";
    }

    if (texto.includes("productos")) {

        respuesta =
            "Actualmente existen " +
            productos.length +
            " productos en inventario.";
    }

    if (
        texto.includes("stock") ||
        texto.includes("inventario")
    ) {

        let totalStock = 0;

        productos.forEach(p => {

            totalStock += p.stock;

        });

        respuesta =
            "El inventario total es de " +
            totalStock +
            " unidades.";
    }

    if (
        texto.includes("producto mas vendido")
    ) {

        respuesta =
            "La función avanzada estará disponible próximamente.";
    }

    chat.innerHTML += `

    <div class="mensaje ia">

        <b>SMART IA:</b> ${respuesta}

    </div>

    `;

    document.getElementById("pregunta").value = "";

    chat.scrollTop = chat.scrollHeight;
}

// =========================
// GUARDAR
// =========================
function guardar() {

    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );

    localStorage.setItem(
        "ventas",
        JSON.stringify(ventas)
    );
}

function activarScanner(){

    let box = document.getElementById("scannerBox");

    box.classList.remove("oculto");

    document.getElementById("buscarProducto").focus();
}


// =========================
// INICIAR
// =========================
mostrarTabla();

mostrarHistorial();

