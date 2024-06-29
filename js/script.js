document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactanosForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const asunto = document.getElementById('asunto').value;
        const mensaje = document.getElementById('mensaje').value;

        const data = {
            nombre: nombre,
            email: email,
            asunto: asunto,
            mensaje: mensaje
        };

        axios.post('https://api-umd-tools.onrender.com/contacto/add', 
            JSON.stringify(data), 
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        .then(function(response) {
            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'La información se guardó correctamente. Pronto nos estaremos comunicando.',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(function() {
                    location.reload(); 
                });
            } else {
                throw new Error('Unexpected status code');
            }
        })
        .catch(function(error) {
            console.error('Error al enviar el formulario:', error);
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'No se pudo guardar tu información de contacto. Por favor, intenta más tarde.',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        });
    });
});
