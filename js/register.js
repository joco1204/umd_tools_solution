
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
    });

    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

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
    });
});