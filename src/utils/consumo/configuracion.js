
import * as valid from '../validations/expresiones.mjs';
import * as alert from '../validations/alertas.mjs';

const url = 'https://backend-valhalla.onrender.com/ruta/roles';

const listarRoles = async () => {
    const tabla = $('#dataTable').DataTable({

        "bProcessing": true, // Habilita la pantalla de carga
        "serverSide": false, // Puedes cambiar esto según tus necesidades

        "columns": [
            { "data": "index" }, // Índice autoincremental
            { "data": "nombreRol" },
            { "data": "descripcion" },
            { "data": "permisos" },
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
            const listaRoles = data.roles;

            // Agregar un índice autoincremental y fecha de registro a los datos
            listaRoles.forEach((roles, index) => {
                roles.index = index + 1;
                roles.fecha_registro = new Date().toLocaleDateString('en-US', { weekday: "long", year: "numeric", month: "short", day: "numeric" });
                if (roles.estado) {
                    roles.estado =`<i class="fas fa-toggle-on toggleSwitch fa-lg" id="cambiar-estado" data-index="${roles._id}" data-estado="${roles.estado}"></i>`;
                  } else {
                    roles.estado =`<i class="fas fa-toggle-off toggleSwitch fa-lg" id="cambiar-estado" data-index="${roles._id}" data-estado="${roles.estado}"></i>`;
                  }        
                roles.botones_accion = `
                    <div class="text-center d-flex justify-content-around">
                        <a href="#" class="btn btn-primary" data-toggle="modal" data-target="#UpdateModal" onclick='verRoles(${JSON.stringify(roles)})'><i class="fas fa-edit"></i></a>
                        <a href="#" class="btn btn-danger" onclick="eliminarRoles('${roles._id}')"><i class="fas fa-trash-alt"></i></a>
                    </div>
                `;
            });

            tabla.clear().draw();
            tabla.rows.add(listaRoles).draw(); 

            // Cambiar de estado
            tabla.on('click', '#cambiar-estado', function () {              
            const userId = this.getAttribute('data-index');
            let currentEstado = this.getAttribute('data-estado'); // Obtiene el atributo como cadena
        
            // Compara la cadena con "true"
            if (currentEstado === "true") {
                this.classList.remove('fa-toggle-on');
                this.classList.add('fa-toggle-off');
                currentEstado = "false"; // Establece la cadena "false"
            } else {
                this.classList.remove('fa-toggle-off');
                this.classList.add('fa-toggle-on');
                currentEstado = "true"; // Establece la cadena "true"
            }

            this.setAttribute('data-estado', currentEstado); // Actualiza el atributo data-estado
            cambiarEstado(userId, currentEstado);
        })
    })
        .catch(function (error) {
            console.error('Error:', error);
        });
}

// ================================================================
// Función para cambiar el estado del servicio
function cambiarEstado(userId, newEstado) {

    const roles = {
        _id: userId,
        estado:newEstado,
    };

    fetch(url, {
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify(roles),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
}    

// ================================================================

const crearRoles = async () => {

    const campos = [
        { id: 'txtNombre', label: 'Nombre del Rol', validacion: valid.validarNombre },
        { id: 'txtDescripcion', label: 'Descripcion del Rol'},
        { id: 'txtPermisos', label: 'Permisos del Rol'}
        // falta validad descripcion y permisos
    ];

    if (!alert.validarCampos(campos)) {
        return;
    }else{
        
        const Roles = {
            nombreRol: document.getElementById('txtNombre').value,
            descripcion: document.getElementById('txtDescripcion').value,
            permisos: document.getElementById('txtPermisos').value,
        };

        fetch(url, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(Roles),
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
                        window.location.href = '/listarRoles';
                    }, 2000);
                }
            })
            .catch((error) => {
                
                console.error('Error al registrar el Rol:', error);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡Error al Registrar el Rol!',
                    text: 'No se pudo procesar la solicitud, Inténtelo nuevamente.',
                    showConfirmButton: false,
                    timer: 1500
                })
                window.location.reload();
            });
    }

}

// ============================================================

const modificarRoles = async () => {

    const campos = [
        { id: 'txtNombre', label: 'Nombre del Rol', validacion: valid.validarNombre },
        { id: 'txtDescripcion', label: 'Descripcion del Rol'},
        { id: 'txtPermisos', label: 'Permisos del Rol'}
    ];

    if (!alert.validarCampos(campos)) {
        return;
    }else{
        
        const roles = {
            _id: document.getElementById('txtID').value,
            nombreRol: document.getElementById('txtNombre').value,
            descripcion: document.getElementById('txtDescripcion').value,
            permisos: document.getElementById('txtPermisos').value,
        };

        fetch(url, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(roles),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
            .then((resp) => resp.json())
            .then((json) => {
                if (json.msg) {

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: '¡Modificación Exitosa!',
                        text: json.msg,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(() => {
                        window.location.href = '/listarRoles';
                    }, 2000);
                }
            })
            .catch((error) => {
                
                console.error('Error al registrar el Rol:', error);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡Error al Modificar el Rol!',
                    text: 'No se pudo procesar la solicitud, Inténtelo nuevamente.',
                    showConfirmButton: false,
                    timer: 1500
                })
                window.location.reload();
            });
    }

}



document.addEventListener("DOMContentLoaded", function () {

    const PageUrl = window.location.href;

    // Verificar si la URL contiene "listarusuarios"
    if (PageUrl.includes("/listarRoles")) {
        listarRoles();

        document.getElementById('btnMdReset').
        addEventListener('click', () => {
            document.getElementById('formModificar').reset()
        })

        document.getElementById('btnMdGuardar').
        addEventListener('click', () => {
            modificarRoles()
        })

    }

    if(PageUrl.includes("/crearRoles")){

        document.getElementById('btnGuardar').
        addEventListener('click', () => {
            crearRoles();
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
                text: 'No se registrará ningún Rol',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, Salir',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    setTimeout(() => {
                        window.location.href = '/listarRoles';
                    }, 1800);
                }
            });
        })
    }

        

});






