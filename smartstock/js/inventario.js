let productos = JSON.parse(localStorage.getItem("productos")) || [];

// ========================================
// MOSTRAR PRODUCTOS
// ========================================

function mostrarTabla(){

    let tabla = document.getElementById("tablaProductos");

    tabla.innerHTML = "";

    productos.forEach((p,index)=>{

        tabla.innerHTML += `

        <tr>

            <td>${p.id}</td>

            <td>${p.codigo}</td>

            <td>${p.nombre}</td>

            <td>$${Number(p.costo).toLocaleString("es-CO")}</td>

            <td>$${Number(p.valor).toLocaleString("es-CO")}</td>

            <td>${p.stock}</td>

            <td>

                <button class="btn-editar"
                onclick="editarProducto(${index})">
                ✏️
                </button>

                <button class="btn-eliminar"
                onclick="eliminarProducto(${index})">
                🗑️
                </button>

            </td>

        </tr>

        `;
    });

}

// ========================================
// AGREGAR PRODUCTO
// ========================================

function agregarProducto(){

    let id = document.getElementById("idProd").value.trim();

    let codigo = document.getElementById("codigo").value.trim();

    let nombre = document.getElementById("nombre").value.trim();

    let costo = parseFloat(
        document.getElementById("costo").value.replace(/\./g,"")
    ) || 0;

    let valor = parseFloat(
        document.getElementById("valor").value.replace(/\./g,"")
    ) || 0;

    let cantidad = parseInt(
        document.getElementById("cantidad").value
    ) || 0;


    // VALIDAR CAMPOS
    if(
        !id ||
        !codigo ||
        !nombre ||
        cantidad <= 0
    ){
        alert("Completa todos los campos");
        return;
    }


    // BUSCAR PRODUCTO EXACTAMENTE IGUAL
    let existente = productos.find(p =>

        p.id === id &&
        p.codigo === codigo &&
        p.nombre.toLowerCase() === nombre.toLowerCase()

    );


    // SI YA EXISTE
    if(existente){

        let confirmar = confirm(
            "Este producto ya existe.\n\n" +
            "¿Deseas SUMAR la cantidad al stock?"
        );

        if(confirmar){

            existente.stock =
                Number(existente.stock) + Number(cantidad);

            guardar();

            mostrarTabla();

            limpiarFormulario();

            alert(
                "Stock actualizado correctamente.\n\n" +
                "Nuevo stock: " + existente.stock
            );
        }

        return;
    }


    // VALIDAR REPETIDOS DIFERENTES
    let conflicto = productos.find(p =>

        p.id === id ||
        p.codigo === codigo ||
        p.nombre.toLowerCase() === nombre.toLowerCase()

    );

    if(conflicto){

        let editar = confirm(

            "⚠ Existe información repetida.\n\n" +

            "Producto encontrado:\n" +

            conflicto.nombre +

            "\n\n¿Deseas editarlo?"
        );

        if(editar){

            let index = productos.indexOf(conflicto);

            editarProducto(index);
        }

        return;
    }


    // CREAR PRODUCTO
    let nuevoProducto = {

        id: id,

        codigo: codigo,

        nombre: nombre,

        costo: costo,

        valor: valor,

        stock: cantidad

    };


    productos.push(nuevoProducto);

    guardar();

    mostrarTabla();

    limpiarFormulario();

    alert("Producto agregado correctamente");
}

// ========================================
// EDITAR PRODUCTO
// ========================================

function editarProducto(index){

    let p = productos[index];

    document.getElementById("idProd").value = p.id;

    document.getElementById("codigo").value = p.codigo;

    document.getElementById("nombre").value = p.nombre;

    document.getElementById("costo").value = p.costo;

    document.getElementById("valor").value = p.valor;

    document.getElementById("cantidad").value = p.stock;


    productos.splice(index,1);

    guardar();

    mostrarTabla();

}

// ========================================
// ELIMINAR PRODUCTO
// ========================================

function eliminarProducto(index){

    let confirmar = confirm(
        "¿Deseas eliminar este producto?"
    );

    if(confirmar){

        productos.splice(index,1);

        guardar();

        mostrarTabla();
    }
}

// ========================================
// LIMPIAR FORMULARIO
// ========================================

function limpiarFormulario(){

    document.getElementById("idProd").value = "";

    document.getElementById("codigo").value = "";

    document.getElementById("nombre").value = "";

    document.getElementById("costo").value = "";

    document.getElementById("valor").value = "";

    document.getElementById("cantidad").value = "";

}

// ========================================
// GUARDAR
// ========================================

function guardar(){

    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );

}

// ========================================
// CERRAR SESIÓN
// ========================================

function cerrarSesion(){

    localStorage.removeItem("usuarioActivo");

    window.location.href = "index.html";

}

// ========================================
// CARGAR TABLA
// ========================================

mostrarTabla();

function toggleMenu(){

    document
    .getElementById("menu")
    .classList
    .toggle("oculto");

}