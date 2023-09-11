const url = 'https://backend-valhalla.onrender.com/ruta/empleados';

const listarEmpleados = async () => {
    const tabla = $('#dataTable').DataTable({

        "bProcessing": true, // Habilita la pantalla de carga
        "serverSide": false, // Puedes cambiar esto según tus necesidades

        "columns": [
            { "data": "index" }, // Índice autoincremental
            { "data": "numeroDocumento" },
            { "data": "nombres" },
            { "data": "apellidos" },
            { "data": "genero" }, // Fecha de registro
            { "data": "telefono" },
            {   // Columna de botones de acción
                "data": "botones_accion",
            }
            // Puedes agregar más columnas según tus datos
        ],
    });

    // Hacer la solicitud a la API
    await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
        .then((resp) => resp.json())
        .then(function (data) {
            const listaEmpleados = data.empleados;

            // Agregar un índice autoincremental y fecha de registro a los datos
            listaEmpleados.forEach((usuario, index) => {
                usuario.index = index + 1;
                usuario.fecha_registro = new Date().toLocaleDateString('en-US', { weekday: "long", year: "numeric", month: "short", day: "numeric" });
                
                usuario.botones_accion = `

                
                <div class=" d-flex justify-content-around">
                    <a href="" class="btn btn-primary" data-toggle="modal" data-target="#UpdateModal"><i class="fas fa-edit" ></i></a>
                    <a href="" class="btn btn-danger" onclick="eliminarEmpleados('${usuario._id}')"><i class="fas fa-trash-alt"></i></a>
                    <a href="" class="btn btn-warning" data-toggle="modal" data-target="#ShowModal"><i class="fas fa-eye"></i></a>
                    <a href="" class="btn btn-info" data-toggle="modal" data-target="#ServicesModal"><i class="fas fa-cut"></i></a>
                </div>
                `;
            });

            tabla.clear().draw();
            tabla.rows.add(listaEmpleados).draw(); 
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}




document.addEventListener("DOMContentLoaded", function () {

    const PageUrl = window.location.href;

    // Verificar si la URL contiene "listarusuarios"
    if (PageUrl.includes("/listarEmpleados")) {
        listarEmpleados();
    }

});






