document.addEventListener('DOMContentLoaded', function() {
    fetch('/pages/layouts/head.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const headContent = doc.head.innerHTML;
            document.head.innerHTML += headContent;
        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud Fetch:', error);
        });
});

