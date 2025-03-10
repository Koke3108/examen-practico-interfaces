const map = L.map('map').setView([36.7213, -4.4216], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

fetch('/data/da_cultura_ocio_monumentos-4326.geojson')
    .then(response => response.json())
    .then(data => {
        console.log('Datos GeoJSON cargados:', data);

        data.features.forEach(feature => {
            const [longitude, latitude, _] = feature.geometry.coordinates;
            const nombre = feature.properties?.NOMBRE || "Nombre no disponible";
            const descripcion = feature.properties?.DESCRIPCION || "Descripción no disponible";
            const tipo = feature.properties?.TIPO || "Ubicación";

            let iconUrl = '/images/studio.png';

            const icon = L.icon({
                iconUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41]
            });

            const marker = L.marker([latitude, longitude], { icon }).addTo(map);

            marker.on('click', () => {
                map.setView([latitude, longitude], 16);
                Swal.fire({
                    title: nombre,
                    text: descripcion,
                    icon: 'info',
                    confirmButtonText: 'OK'
                });
            });

            const listItem = document.createElement('button');
            listItem.className = 'list-group-item list-group-item-action';
            listItem.innerText = nombre;
            listItem.onclick = () => {
                map.setView([latitude, longitude], 16);
                marker.fire('click');
            };
            document.getElementById('monument-list').appendChild(listItem);
        });
    })
    .catch(error => console.error('Error al cargar el archivo GeoJSON:', error));
