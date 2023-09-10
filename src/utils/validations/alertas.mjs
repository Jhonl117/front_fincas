
// Funcion para Mostrar Errores

export const mostrarError = (campoId, mensaje) => {
    const campo = document.getElementById(campoId);
    campo.classList.add('is-invalid');
    const errorDiv = document.getElementById(`${campoId}Error`);
    errorDiv.textContent = mensaje;
};

// Funcion para Limpiar Errores
export const limpiarError = (campoId) => {
    const campo = document.getElementById(campoId);
    campo.classList.remove('is-invalid');
    const errorDiv = document.getElementById(`${campoId}Error`);
    errorDiv.textContent = '';
}; 

// Funcion para Validar Campos
export const validarCampos = (config) => {
    for (const campo of config) {
        const valor = document.getElementById(campo.id).value;
        if (!valor || valor === 'disabled') {
            mostrarError(campo.id, `Por favor, complete el campo ${campo.label}.`);
            return false;
        } else if (campo.validacion && !campo.validacion(valor)) {
            mostrarError(campo.id, `Por favor, ingrese un(a) ${campo.label} válido(a).`);
            return false;
        } else {
            limpiarError(campo.id);
        }
    }
    return true;
};



