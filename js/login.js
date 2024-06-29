const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('email_institucional', document.getElementById('usuario').value);
        formData.append('password', document.getElementById('contrasena').value);

        try {
            const response = await axios.get('https://api-umd-tools.onrender.com/user/login', {
                params: formData
            });

            if (response.data === true) {
                window.location.href = '../pages/home/index.html';
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Usuario y/o contraseña incorrectos.',
                });
            }
        } catch (error) {
            console.error('Error al intentar iniciar sesión:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo iniciar sesión. Intente nuevamente más tarde.',
            });
        }
    });