function agregarProducto(){

    let id = document.getElementById("idProd").value;
    let codigo = document.getElementById("codigo").value;
    let nombre = document.getElementById("nombre").value;
    let costo = document.getElementById("costo").value;
    let valor = document.getElementById("valor").value;

    if(!nombre || !valor){
        alert("Completa los datos");
        return;
    }

    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    productos.push({
        id,
        codigo,
        nombre,
        costo: parseFloat(costo) || 0,
        valor: parseFloat(valor),
        stock: 10
    });

    localStorage.setItem("productos", JSON.stringify(productos));

    mostrarProductos();
}

function mostrarProductos(){

    let tabla = document.getElementById("tablaProductos");
    tabla.innerHTML = "";

    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    productos.forEach(p=>{
        tabla.innerHTML += `
        <tr>
            <td>${p.id || "-"}</td>
            <td>${p.codigo || "-"}</td>
            <td>${p.nombre}</td>
            <td>$${p.valor}</td>
            <td>${p.stock}</td>
        </tr>
        `;
    });
}

mostrarProductos();