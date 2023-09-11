
import * as valid from '../validations/expresiones.mjs';
import * as alert from '../validations/alertas.mjs';

const validarAcceso = () => {

    const campos = [
        { id: 'txtUsername', label: 'Username', validacion: valid.validarUsername},
        { id: 'txtCorreo', label: 'Correo', validacion: valid.validarCorreo },
        { id: 'txtPassword', label: 'Contraseña', validacion: valid.validarPassword},
    ];

    const datos = {
        usuarioValido: 'Admin',
        correoValido: 'Admin28@gmail.com',
        passwordvalido: 'Admin123',
        username: document.getElementById('txtUsername').value,
        correo: document.getElementById('txtCorreo').value,
        password: document.getElementById('txtPassword'),
    };

    if (!alert.validarCampos(campos)) {
        return;
    }

    if(datos.username === datos.usuarioValido &&
        datos.correo === datos.correoValido && 
        datos.password === datos.password){

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Login Exitoso!',
                text: 'Se validaron las credenciales, bienvenido!',
                showConfirmButton: false,
                timer: 1500
            })
            setTimeout(() => {
                window.location.href = '/panelAdministrativo';
            }, 2000);
    }else{
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '¡Error Login!',
            text: 'las credenciales no son correctas, intentelo nuevamente!',
            showConfirmButton: false,
            timer: 1500
        })
    }

    

}






document.addEventListener("DOMContentLoaded", function () {

    


    document.getElementById('btnContinuar').
        addEventListener('click', (event) => {
            event.preventDefault();
            validarAcceso();
        })

});