// Función para convertir unidades a una unidad base (por ejemplo, litros y kilogramos)
function convertirUnidad(cantidad, unidad) {
    const conversiones = {
        'cc': 0.001,
        'ml': 0.001,
        'l': 1,
        'gr': 0.001,
        'kg': 1
    };

    return cantidad * conversiones[unidad];
}

// Función para agregar un producto a la tabla
function agregarProducto() {
    const costo = parseFloat(document.getElementById('costo').value);
    const unidad = document.getElementById('unidad').value;
    const cantidad = parseFloat(document.getElementById('cantidad').value);

    if (isNaN(costo) || isNaN(cantidad)) {
        alert('Ingrese valores válidos.');
        return;
    }

    const cantidadLitros = convertirUnidad(cantidad, unidad);
    const cantidadKilogramos = convertirUnidad(cantidad, unidad);

    const costoPorLitro = costo / cantidadLitros;
    const costoPorKilogramo = costo / cantidadKilogramos;

    const tabla = document.getElementById('productos').getElementsByTagName('tbody')[0];
    const fila = tabla.insertRow();

    fila.insertCell().textContent = `Producto ${tabla.rows.length}`;
    fila.insertCell().textContent = `$${costoPorLitro.toFixed(2)} por litro`;
    fila.insertCell().textContent = `$${costoPorKilogramo.toFixed(2)} por kilogramo`;

    // Crear y agregar el botón de eliminar
    const celdaAcciones = fila.insertCell();
    const botonEliminar = document.createElement('button');
    botonEliminar.textContent = 'Eliminar';
    botonEliminar.className = 'eliminar';
    botonEliminar.onclick = () => eliminarProducto(fila);
    celdaAcciones.appendChild(botonEliminar);

    actualizarTabla();
}

// Función para eliminar un producto de la tabla
function eliminarProducto(fila) {
    const tabla = document.getElementById('productos').getElementsByTagName('tbody')[0];
    tabla.removeChild(fila);
    actualizarTabla();
}

// Función para actualizar la tabla con los productos y el gráfico
function actualizarTabla() {
    const tabla = document.getElementById('productos').getElementsByTagName('tbody')[0];
    const filas = Array.from(tabla.getElementsByTagName('tr'));
    
    filas.sort((a, b) => {
        const costoA = parseFloat(a.cells[1].textContent.replace(/[^0-9.-]+/g, ''));
        const costoB = parseFloat(b.cells[1].textContent.replace(/[^0-9.-]+/g, ''));
        return costoA - costoB;
    });

    filas.forEach((fila, index) => {
        fila.classList.remove('economico', 'caro');
        if (index === 0) fila.classList.add('economico');
        if (index === filas.length - 1) fila.classList.add('caro');
    });

    const ctx = document.getElementById('grafico').getContext('2d');
    const etiquetas = filas.map(fila => fila.cells[0].textContent);
    const datos = filas.map(fila => parseFloat(fila.cells[1].textContent.replace(/[^0-9.-]+/g, '')));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Costo por Litro',
                data: datos,
                backgroundColor: '#36A2EB',
                borderColor: '#36A2EB',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}