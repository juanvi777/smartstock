let ventas = JSON.parse(localStorage.getItem("ventas")) || [];

let usuario = localStorage.getItem("usuarioActivo");

if(!usuario){

    window.location.href = "index.html";

}

document.getElementById("nombreTienda").textContent =
"SMART STOCK | " + usuario;

// ===========================
// FORMATO PESOS
// ===========================
function formatoPeso(numero){

    return "$" + Number(numero).toLocaleString("es-CO");

}

// ===========================
// MOSTRAR HISTORIAL
// ===========================
function mostrarHistorial() {

    let contenedor = document.getElementById("historialVentas");

    contenedor.innerHTML = "";

    if (ventas.length === 0) {

        contenedor.innerHTML = `
        <h2>No existen ventas registradas</h2>
        `;

        return;
    }

    [...ventas].reverse().forEach((venta,index) => {

        contenedor.innerHTML += `

        <div class="card-historial">

            <div class="top-historial">

                <div>

                    <h2>
                        🧾 Venta #${ventas.length-index}
                    </h2>

                    <p>
                        ${venta.fecha} - ${venta.hora}
                    </p>

                </div>

                <div class="total-historial">

                    ${formatoPeso(venta.total)}

                </div>

            </div>

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

                    ${venta.productos.map(producto => `

                    <tr>

                        <td>${producto.id}</td>

                        <td>${producto.codigo}</td>

                        <td>${producto.nombre}</td>

                        <td>${producto.cantidad}</td>

                    </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>

        `;
    });

    contenedor.innerHTML += `

    <div class="contenedor-analisis">

        <button 
        class="btn-analisis"
        onclick="abrirAnalisis()">

            📊 Ver análisis inteligente

        </button>

    </div>

    `;
}

// ===========================
// ABRIR ANALISIS
// ===========================
function abrirAnalisis(){

    document.getElementById("modalAnalisis").style.display = "flex";

    generarAnalisis();

}

// ===========================
// CERRAR ANALISIS
// ===========================
function cerrarAnalisis(){

    document.getElementById("modalAnalisis").style.display = "none";

}

// ===========================
// ANALISIS IA
// ===========================
function generarAnalisis(){

    let resultado = document.getElementById("resultadoAnalisis");

    let contador = {};

    ventas.forEach(v => {

        v.productos.forEach(p => {

            if(!contador[p.nombre]){

                contador[p.nombre] = 0;

            }

            contador[p.nombre] += p.cantidad;

        });

    });

    let masVendido = "";
    let menosVendido = "";

    let max = 0;
    let min = Infinity;

    for(let producto in contador){

        if(contador[producto] > max){

            max = contador[producto];

            masVendido = producto;

        }

        if(contador[producto] < min){

            min = contador[producto];

            menosVendido = producto;

        }

    }

    let pedido = max * 2;

    resultado.innerHTML = `

    <div class="analisis-grid">

        <div class="card-analisis">

            <h2>
                🔥 Producto más vendido
            </h2>

            <h1>
                ${masVendido}
            </h1>

            <p>
                ${max} vendidos
            </p>

        </div>

        <div class="card-analisis">

            <h2>
                ❄ Producto menos vendido
            </h2>

            <h1>
                ${menosVendido}
            </h1>

            <p>
                ${min} vendidos
            </p>

        </div>

        <div class="card-analisis ia-card">

            <h2>
                🤖 SMART IA
            </h2>

            <p>

                SMART IA recomienda pedir
                aproximadamente

                <strong>${pedido}</strong>

                unidades de

                <strong>${masVendido}</strong>

                debido a su alta rotación.

            </p>

        </div>

    </div>

    `;
}

mostrarHistorial();