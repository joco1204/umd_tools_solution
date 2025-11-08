async function obtenerDepartamentos() {
    try {
        const response = await axios.get('https://www.datos.gov.co/resource/xdk5-pm3f.json?$select=distinct%20departamento');
        const departamentos = response.data.map(item => item.departamento);
        
        const selectDepartamento = document.getElementById('departamento');
        departamentos.forEach(departamento => {
            const option = document.createElement('option');
            option.value = departamento;
            option.textContent = departamento;
            selectDepartamento.appendChild(option);
        });
    } catch (error) {
        console.error('Error al obtener los departamentos:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener los departamentos. Intente nuevamente más tarde.',
        });
    }
}

async function obtenerCiudades(departamentoSeleccionado) {
    try {
        const response = await axios.get(`https://www.datos.gov.co/resource/xdk5-pm3f.json?departamento=${departamentoSeleccionado}&$select=municipio`);
        const ciudades = response.data.map(item => item.municipio);
        
        const selectCiudad = document.getElementById('ciudad');
        selectCiudad.innerHTML = '<option value="">Seleccione una ciudad</option>';

        ciudades.forEach(ciudad => {
            const option = document.createElement('option');
            option.value = ciudad;
            option.textContent = ciudad;
            selectCiudad.appendChild(option);
        });
    } catch (error) {
        console.error(`Error al obtener las ciudades del departamento ${departamentoSeleccionado}:`, error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `No se pudo obtener las ciudades del departamento ${departamentoSeleccionado}. Intente nuevamente más tarde.`,
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    obtenerDepartamentos();

    const selectDepartamento = document.getElementById('departamento');
    selectDepartamento.addEventListener('change', (event) => {
        const departamentoSeleccionado = event.target.value;
        if (departamentoSeleccionado) {
            obtenerCiudades(departamentoSeleccionado);
        } else {
            const selectCiudad = document.getElementById('ciudad');
            selectCiudad.innerHTML = '<option value="">Seleccione una ciudad</option>';
        }
        validateSelect(event.target.id, `error${capitalizeFirstLetter(event.target.id)}`);
    });

    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (validateForm()) {
            const data = {
                nombres: document.getElementById('nombres').value,
                apellidos: document.getElementById('apellidos').value,
                tipo_identificacion: document.getElementById('tipoIdentificacion').value,
                numero_identificacion: document.getElementById('numeroIdentificacion').value,
                email_personal: document.getElementById('emailPersonal').value,
                email_institucional: document.getElementById('emailInstitucional').value,
                celular: document.getElementById('celular').value,
                direccion_residencia: document.getElementById('direccionResidencia').value,
                departamento: document.getElementById('departamento').value,
                ciudad: document.getElementById('ciudad').value,
                facultad: document.getElementById('facultad').value,
                programa: document.getElementById('programa').value,
                password: document.getElementById('contrasena').value
            };

            try {
                const response = await axios.post('https://api-umd-tools.onrender.com/user/add', 
                    JSON.stringify(data), 
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                if (response.status === 201) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'Usuario agregado con éxito.',
                    }).then(() => {
                        window.location.reload();
                    });
                }
            } catch (error) {
                console.error('Error al crear el usuario:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo crear el usuario. Intente nuevamente más tarde.',
                });
            }
        }
    });

    const inputs = form.querySelectorAll('.form-control, .form-select');
    inputs.forEach(input => {
        input.addEventListener('change', () => validateInput(input));
        input.addEventListener('input', () => validateInput(input));
    });

    function validateInput(element) {
        const errorElement = document.getElementById(`error${capitalizeFirstLetter(element.id)}`);
        if (element.id === 'numeroIdentificacion') {
            validateIdentificationNumber();
        } else if (element.id === 'emailPersonal' || element.id === 'emailInstitucional') {
            validateEmail(element.id, `error${capitalizeFirstLetter(element.id)}`);
        } else if (element.id === 'celular') {
            validatePhoneNumber(element.id, `error${capitalizeFirstLetter(element.id)}`);
        } else if (element.id === 'contrasena') {
            validatePassword(element.id, `error${capitalizeFirstLetter(element.id)}`);
            validateConfirmPassword('contrasena', 'confirmarContrasena', 'errorConfirmarContrasena');
        } else if (element.id === 'confirmarContrasena') {
            validateConfirmPassword('contrasena', 'confirmarContrasena', 'errorConfirmarContrasena');
        } else if (element.id === 'direccionResidencia'){
            validateDireccion()
        } else if (element.classList.contains('form-select')) {
            validateSelect(element.id, `error${capitalizeFirstLetter(element.id)}`);
        } else {
            validateTextInput(element.id, /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/, `error${capitalizeFirstLetter(element.id)}`);
        }

        if (errorElement.style.display === 'none') {
            element.classList.remove('is-invalid');
        }
    }

    function validateForm() {
        let isValid = true;
        resetValidation();

        if (!validateTextInput('nombres', /^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+$/, 'errorNombres')) isValid = false;
        if (!validateTextInput('apellidos', /^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+$/, 'errorApellidos')) isValid = false;
        if (!validateSelect('tipoIdentificacion', 'errorTipoIdentificacion')) isValid = false;
        if (!validateIdentificationNumber()) isValid = false;
        if (!validateEmail('emailPersonal', 'errorEmailPersonal')) isValid = false;
        if (!validateEmail('emailInstitucional', 'errorEmailInstitucional')) isValid = false;
        if (!validatePhoneNumber('celular', 'errorCelular')) isValid = false;
        if (!validateDireccion()) isValid = false;
        if (!validateSelect('departamento', 'errorDepartamento')) isValid = false;
        if (!validateSelect('ciudad', 'errorCiudad')) isValid = false;
        if (!validateTextInput('facultad', /^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+$/, 'errorFacultad')) isValid = false;
        if (!validateTextInput('programa', /^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+$/, 'errorPrograma')) isValid = false;
        if (!validatePassword('contrasena', 'errorContrasena')) isValid = false;
        if (!validateConfirmPassword('contrasena', 'confirmarContrasena', 'errorConfirmarContrasena')) isValid = false;
        if (!validateCheckbox('terminos', 'errorTerminos')) isValid = false;

        return isValid;
    }

    function validateTextInput(id, pattern, errorId) {
        const element = document.getElementById(id);
        const errorElement = document.getElementById(errorId);
        const value = element.value.trim();

        if (!value.match(pattern)) {
            element.classList.add('is-invalid');
            errorElement.style.display = 'block';
            return false;
        }

        errorElement.style.display = 'none';
        element.classList.remove('is-invalid');
        return true;
    }

    function validateDireccion() {
        const element = document.getElementById('direccionResidencia');
        const errorElement = document.getElementById('errorDireccionResidencia');
        const value = element.value;
        const emailPattern = /^[a-zA-Z0-9\s\W]+$/;

        if (!value.match(emailPattern)) {
            element.classList.add('is-invalid');
            errorElement.style.display = 'block';
            return false;
        }

        errorElement.style.display = 'none';
        element.classList.remove('is-invalid');
        return true;
    }

    function validateSelect(id, errorId) {
        const element = document.getElementById(id);
        const errorElement = document.getElementById(errorId);
        const value = element.value.trim();

        if (!value) {
            element.classList.add('is-invalid');
            errorElement.style.display = 'block';
            return false;
        }

        errorElement.style.display = 'none';
        element.classList.remove('is-invalid');
        return true;
    }

    function validateIdentificationNumber() {
        const tipoIdentificacion = document.getElementById('tipoIdentificacion').value;
        const numeroIdentificacion = document.getElementById('numeroIdentificacion').value.trim();
        const errorElement = document.getElementById('errorNumeroIdentificacion');

        if (tipoIdentificacion === 'pa' || tipoIdentificacion === 'pe') {
            if (!numeroIdentificacion.match(/^[0-9A-Za-z]+$/)) {
                document.getElementById('numeroIdentificacion').classList.add('is-invalid');
                errorElement.style.display = 'block';
                return false;
            }
        } else {
            if (!numeroIdentificacion.match(/^[0-9]+$/)) {
                document.getElementById('numeroIdentificacion').classList.add('is-invalid');
                errorElement.style.display = 'block';
                return false;
            }
        }

        errorElement.style.display = 'none';
        document.getElementById('numeroIdentificacion').classList.remove('is-invalid');
        return true;
    }

    function validateEmail(id, errorId) {
        const element = document.getElementById(id);
        const errorElement = document.getElementById(errorId);
        const value = element.value.trim();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!value.match(emailPattern)) {
            element.classList.add('is-invalid');
            errorElement.style.display = 'block';
            return false;
        }

        errorElement.style.display = 'none';
        element.classList.remove('is-invalid');
        return true;
    }

    function validatePhoneNumber(id, errorId) {
        const element = document.getElementById(id);
        const errorElement = document.getElementById(errorId);
        const value = element.value.trim();
        const phonePattern = /^[0-9]{10}$/;

        if (!value.match(phonePattern)) {
            element.classList.add('is-invalid');
            errorElement.style.display = 'block';
            return false;
        }

        errorElement.style.display = 'none';
        element.classList.remove('is-invalid');
        return true;
    }

    function validatePassword(id, errorId) {
        const element = document.getElementById(id);
        const errorElement = document.getElementById(errorId);
        const value = element.value.trim();
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!value.match(passwordPattern)) {
            element.classList.add('is-invalid');
            errorElement.style.display = 'block';
            return false;
        }

        errorElement.style.display = 'none';
        element.classList.remove('is-invalid');
        return true;
    }

    function validateConfirmPassword(passwordId, confirmPasswordId, errorId) {
        const passwordElement = document.getElementById(passwordId);
        const confirmPasswordElement = document.getElementById(confirmPasswordId);
        const errorElement = document.getElementById(errorId);

        if (passwordElement.value.trim() !== confirmPasswordElement.value.trim()) {
            confirmPasswordElement.classList.add('is-invalid');
            errorElement.style.display = 'block';
            return false;
        }

        errorElement.style.display = 'none';
        confirmPasswordElement.classList.remove('is-invalid');
        return true;
    }

    function validateCheckbox(id, errorId) {
        const checkbox = document.getElementById(id);
        const errorElement = document.getElementById(errorId);

        if (!checkbox.checked) {
            errorElement.style.display = 'block';
            return false;
        }

        errorElement.style.display = 'none';
        return true;
    }

    function resetValidation() {
        const inputs = form.querySelectorAll('.form-control, .form-select');
        const errorMessages = form.querySelectorAll('.invalid-feedback');

        inputs.forEach(input => {
            input.classList.remove('is-invalid');
        });

        errorMessages.forEach(error => {
            error.style.display = 'none';
        });
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});
