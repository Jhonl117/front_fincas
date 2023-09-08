
const mostrarServicios = (categoria) => {

    const servicios = document.querySelectorAll('.listar-servicios');
    servicios.forEach(() => {
        servicios.style.display = 'none';
    });

    const serviciosCategoria = document.querySelector('#' + categoria);
    serviciosCategoria.style.display = 'block';
}