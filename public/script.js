const map = L.map('map').setView([21.03, -101.56], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap contributors'
}).addTo(map);

let maker;
map.on("click", function(e) {
    const { lat, lng } = e.latlng;

    document.getElementById("lat").value = lat;
    document.getElementById("lng").value = lng;

    if (maker) {
        map.removeLayer(maker);
    }
    maker = L.marker([lat, lng]).addTo(map)
        .bindPopup(`Lat: ${lat}<br>Lng: ${lng}`).openPopup();
});

document.getElementById("place-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const latitude = parseFloat(document.getElementById("lat").value);
    const longitude = parseFloat(document.getElementById("lng").value);

    const response = await fetch("/places", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, description, latitude, longitude })
    });

    const data = await response.json();
    alert("Lugar registrado!");
    location.reload();
});

async function loadPlaces() {
    const res = await fetch("/places");
    const places = await res.json();
    
    places.forEach(place => {
        const [lng, lat] = place.location.coordinates;
        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<strong>${place.name}</strong><br>${place.description}`);
    });
}

loadPlaces();