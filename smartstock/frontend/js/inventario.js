function agregarProducto(){

let nombre=document.getElementById("nombre").value;
let precio=document.getElementById("valor").value;

let productos=JSON.parse(localStorage.getItem("productos"))||[];

productos.push({nombre,precio});

localStorage.setItem("productos",JSON.stringify(productos));

mostrarProductos();
}

function mostrarProductos(){

let tabla=document.getElementById("tablaProductos");
tabla.innerHTML="";

let productos=JSON.parse(localStorage.getItem("productos"))||[];

productos.forEach(p=>{
tabla.innerHTML+=`
<tr>
<td>-</td>
<td>-</td>
<td>${p.nombre}</td>
<td>${p.precio}</td>
<td>Disponible</td>
</tr>
`;
});
}

mostrarProductos();