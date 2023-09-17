import * as valid from '../validations/expresiones.mjs';
import * as alert from '../validations/alertas.mjs';

const url = 'https://backend-valhalla.onrender.com/ruta/categorias';

const listarCategorias = async () => {
    const tabla = $('#dataTable').DataTable({

        "bProcessing": true, // Habilita la pantalla de carga
        "serverSide": false, // Puedes cambiar esto según tus necesidades

        "columns": [
            { "data": "index" }, // Índice autoincremental
            { "data": "codigoCategoria" }, 
            { "data": "nombre" },
            { "data": "descripcion" },
            { "data": "estado" },
            {   // Columna de botones de acción
                "data": "botones_accion",
                
            }
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
        const listaCategorias = data.categoria;
        console.log(listaCategorias)
        // Agregar un índice autoincremental y fecha de registro a los datos
        listaCategorias.forEach((categoria, index) => {
            categoria.index = index + 1;
            categoria.fecha_registro = new Date().toLocaleDateString('en-US', { weekday: "long", year: "numeric", month: "short", day: "numeric" });
            if (categoria.estado) {
                categoria.estado =`<i class="fas fa-toggle-on toggleSwitch fa-lg" id="cambiar-estado" data-index="${categoria._id}" data-estado="${categoria.estado}"></i>`;
              } else {
                categoria.estado =`<i class="fas fa-toggle-off toggleSwitch fa-lg" id="cambiar-estado" data-index="${categoria._id}" data-estado="${categoria.estado}"></i>`;
              }     
            categoria.botones_accion = `
                <div class=" d-flex justify-content-around">
                    <a href="" class="btn btn-primary" data-toggle="modal" data-target="#UpdateModal" onclick='verCategorias(${JSON.stringify(categoria)})'><i class="fas fa-edit" ></i></a>
                    <a href="" class="btn btn-danger" onclick="eliminarCategorias('${categoria._id}')"><i class="fas fa-trash-alt"></i></a>
                </div>
            `;
        });

        tabla.clear().draw();
        tabla.rows.add(listaCategorias).draw();

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
// Función para cambiar el estado de la categoria
function cambiarEstado(userId, newEstado) {

    const categorias = {
        _id: userId,
        estado:newEstado,
    };

    fetch(url, {
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify(categorias),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
}    

// FUNCION PARA CAMBIAR EL BOTON AL HACER CLICK

const crearCategorias = async () => {

    const campos = [
        { id: 'txtNombre', label: 'Nombre Categoria', validacion: valid.validarNombre },
        { id: 'txtCodigo', label: 'Codigo Categoria', validacion: valid.validarCodigo },
        { id: 'txtDescripcion', label: 'Descripcion Categoria', validacion: valid.validarTextArea},
        { id: 'txtObservaciones', label: 'Observaciones Categoria', validacion: valid.validarTextArea}
    ];

    if (!alert.validarCampos(campos)) {
        return;
    }else{
        
        const categorias = {
            nombre: document.getElementById('txtNombre').value,
            codigoCategoria: document.getElementById('txtCodigo').value,
            descripcion: document.getElementById('txtDescripcion').value,
            observaciones: document.getElementById('txtObservaciones').value,
        };

        fetch(url, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(categorias),
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
                        window.location.href = '/listarCategorias';
                    }, 2000);
                }
            })
            .catch((error) => {
                
                console.error('Error al registrar categoría:', error);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡Error al Registrar Categoría!',
                    text: 'No se pudo procesar la solicitud, Inténtelo nuevamente.',
                    showConfirmButton: false,
                    timer: 1500
                })
                window.location.reload();
            });
    }

}

// =============================================================================


const modificarCategorias = async () => {

    const campos = [
        { id: 'txtNombre', label: 'Nombre Categoria', validacion: valid.validarNombre },
        { id: 'txtCodigo', label: 'Codigo Categoria', validacion: valid.validarCodigo },
        { id: 'txtDescripcion', label: 'Descripcion Categoria', validacion: valid.validarTextArea},
        { id: 'txtObservaciones', label: 'Observaciones Categoria', validacion: valid.validarTextArea}
    ];

    if (!alert.validarCampos(campos)) {
        return;
    }else{
        
        const categorias = {
            _id: document.getElementById('txtID').value,
            nombre: document.getElementById('txtNombre').value,
            codigoCategoria: document.getElementById('txtCodigo').value,
            descripcion: document.getElementById('txtDescripcion').value,
            observaciones: document.getElementById('txtObservaciones').value,
        };

        fetch(url, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(categorias),
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
                        window.location.href = '/listarCategorias';
                    }, 2000);
                }
            })
            .catch((error) => {
                
                console.error('Error al registrar categoria:', error);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡Error al Registrar Categoría!',
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
    if (PageUrl.includes("/listarCategorias")) {
        
        listarCategorias();


        document.getElementById('btnMdReset').
        addEventListener('click', () => {
            document.getElementById('formModificar').reset()
        })

        document.getElementById('btnMdGuardar').
        addEventListener('click', () => {
            modificarCategorias()
        })



    }

    if(PageUrl.includes("/crearCategorias")){

        document.getElementById('btnGuardar').
        addEventListener('click', () => {
            crearCategorias();
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
                text: 'No se registrará ninguna categoría',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, Salir',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    setTimeout(() => {
                        window.location.href = '/listarCategorias';
                    }, 1800);
                }
            });
        })
    }

});

