import * as valid from '../validations/expresiones.mjs';
import * as alert from '../validations/alertas.mjs';

const url = 'https://backend-valhalla.onrender.com/ruta/servicios';

const listarServicios = async () => {
    const tabla = $('#dataTable').DataTable({

        "bProcessing": true, // Habilita la pantalla de carga
        "serverSide": false, // Puedes cambiar esto según tus necesidades

        "columns": [
            { "data": "index" }, // Índice autoincremental
            { "data": "nombre" },
            { "data": "duracion" },
            { "data": "precio" },
            { "data": "categoria" },
            { "data": "estado" },
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
        const listaServicios = data.servicio;
        console.log(listaServicios)
        // Agregar un índice autoincremental y fecha de registro a los datos
        listaServicios.forEach((servicio, index) => {
            servicio.index = index + 1;
            servicio.fecha_registro = new Date().toLocaleDateString('en-US', { weekday: "long", year: "numeric", month: "short", day: "numeric" });
            if (servicio.estado) {
                servicio.estado = `<button class="btn btn-success cambiar-estado" data-index="${servicio._id}" data-estado="false"><i class="fas fa-check"></i></button>`;
            } else {
                servicio.estado = `<button class="btn btn-danger cambiar-estado" data-index="${servicio._id}" data-estado="true"><i class="fas fa-times"></i></button>`;
            }    
            servicio.botones_accion = `
                <div class="text-center d-flex justify-content-around">
                    <a href="" class="btn btn-primary" data-toggle="modal" data-target="#UpdateModal" onclick='verServicios(${JSON.stringify(servicio)})' ><i class="fas fa-edit"></i></a>
                    <a href="" class="btn btn-danger" onclick="eliminarServicios('${servicio._id}')"><i class="fas fa-trash-alt"></i></a>
                    <a href="" class="btn btn-warning" data-toggle="modal" data-target="#ShowModal" ><i class="fas fa-eye"></i></a>
                </div>
            `;
        });

        tabla.clear().draw();
        tabla.rows.add(listaServicios).draw(); 

        tabla.on('click', '.cambiar-estado', function () {
            const button = this;
            const userId = button.getAttribute('data-index');
            const newEstado = button.getAttribute('data-estado');
    
            cambiarEstado(userId, newEstado);
            });
    })

    .catch(function (error) {
        console.error('Error:', error);
    });
}
// =============================================================================

function cambiarEstado(userId, newEstado) {

    const servicios = {
        _id: userId,
        estado:newEstado,
    };

    fetch(url, {
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify(servicios),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
        .then((resp) => resp.json())
            setTimeout(() => {
            window.location.href = '/listarServicios';
        }, 2000);
}      


// =============================================================================

const crearServicios = async () => {

    const campos = [
        { id: 'txtNombre', label: 'Nombres', validacion: valid.validarNombre },
        { id: 'txtDuracion', label: 'Duracion', validacion: valid.validar},
        { id: 'txtPrecio', label: 'Precio', validacion: valid.validarPrecio},
        { id: 'selCategoria', label: 'Categoria', validacion: valid.validarCategoria},
        { id: 'txtDescripcion', label: 'Descripcion', validacion: valid.validarDescripcion}
    ];

    if (!alert.validarCampos(campos)) {
        return;
    }else{
        
        const servicios = {
            nombre: document.getElementById('txtNombre').value,
            duracion: document.getElementById('txtDuracion').value,
            precio: document.getElementById('txtPrecio').value, 
            categoria: document.getElementById('selCategoria').value, 
            descripcion: document.getElementById('txtDescripcion').value, 
        };

        fetch(url, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(servicios),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
            .then((resp) => resp.json())
            .then((json) => {
                if (json.msg) {

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: '¡Registro Exitoso!',
                        text: json.msg,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(() => {
                        window.location.href = '/listarServicios';
                    }, 2000);
                }
            })
            .catch((error) => {
                
                console.error('Error al registrar el servicio:', error);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡Error al Registrar el Servicio!',
                    text: 'No se pudo procesar la solicitud, Inténtelo nuevamente.',
                    showConfirmButton: false,
                    timer: 1500
                })
                window.location.reload();
            });
    }

}

// =============================================================================

const modificarServicios = async () => {

    const campos = [
        { id: 'txtNombre', label: 'Nombres', validacion: valid.validarNombre },
        { id: 'txtDuracion', label: 'Duracion', validacion: valid.validarDuracion},
        { id: 'txtPrecio', label: 'Precio', validacion: valid.validarPrecio},
        { id: 'selCategoria', label: 'Categoria'},
        { id: 'txtDescripcion', label: 'Descripcion', validacion: valid.validarDescripcion}
    ];

    if (!alert.validarCampos(campos)) {
        return;
    }else{
        
        const servicio = {
            _id: document.getElementById('txtID').value,
            nombre: document.getElementById('txtNombre').value,
            duracion: document.getElementById('txtDuracion').value,
            precio: document.getElementById('txtPrecio').value, 
            categoria: document.getElementById('selCategoria').value, 
            descripcion: document.getElementById('txtDescripcion').value, 
        };

        fetch(url, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(servicio),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
            .then((resp) => resp.json())
            .then((json) => {
                if (json.msg) {

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: '¡Modificacion Exitosa!',
                        text: json.msg,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(() => {
                        window.location.href = '/listarServicios';
                    }, 2000);
                }
            })
            .catch((error) => {
                
                console.error('Error al registrar el servicio:', error);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡Error al Registrar el Servicio!',
                    text: 'No se pudo procesar la solicitud, Inténtelo nuevamente.',
                    showConfirmButton: false,
                    timer: 1500
                })
                window.location.reload();
            });
    }

}



// Eventos JavaScript CLientes

document.addEventListener("DOMContentLoaded", function () {

    const PageUrl = window.location.href;

    // Verificar si la URL contiene "listarusuarios"
    if (PageUrl.includes("/listarServicios")) {
        listarServicios();

        document.getElementById('btnMdReset').
        addEventListener('click', () => {
            document.getElementById('formModificar').reset()
        })

        document.getElementById('btnMdGuardar').
        addEventListener('click', () => {
            modificarServicios()
        })
    }

    if(PageUrl.includes("/crearServicios")){

        document.getElementById('btnGuardar').
        addEventListener('click', () => {
            crearServicios();
        })

        document.getElementById('btnReset').
        addEventListener('click', (event) => {
            event.preventDefault()
            document.getElementById('formModificar').reset()
        })

        document.getElementById('btnCancelar').
        addEventListener('click', (event) => {
            event.preventDefault()
            
            Swal.fire({
                title: '¿Estas Seguro?',
                text: 'No se registrara ningun Servicio',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, Salir',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    setTimeout(() => {
                        window.location.href = '/listarServicios';
                    }, 1800);
                }
            });
        })
    }
});