const map = L.map('map').setView([21.03, -101.56], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap contributors'
}).addTo(map);

let currentMarker = null;
let markers = {};

map.on("click", function(e) {
    const { lat, lng } = e.latlng;
    setFormCoords(lat, lng);
    placeTempMarker(lat, lng);
});

function placeTempMarker(lat, lng) {
    if (currentMarker) map.removeLayer(currentMarker);
    currentMarker = L.marker([lat, lng]).addTo(map)
        .bindPopup("Nueva ubicación seleccionada").openPopup();
}

function setFormCoords(lat, lng) {
    document.getElementById("lat").value = lat;
    document.getElementById("lng").value = lng;
    document.getElementById("lat-display").textContent = lat.toFixed(4);
    document.getElementById("lng-display").textContent = lng.toFixed(4);
}

const form = document.getElementById("place-form");
const btnCancel = document.getElementById("btn-cancel");
const btnSave = document.getElementById("btn-save");

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const id = document.getElementById("place-id").value;
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const latitude = parseFloat(document.getElementById("lat").value);
    const longitude = parseFloat(document.getElementById("lng").value);


    if(isNaN(latitude) || isNaN(longitude)) {
        alert("Por favor selecciona un punto en el mapa");
        return;
    }

    const payload = { name, description, latitude, longitude };
    
    try {
        let url = "/places";
        let method = "POST";

        if (id) {
            url = `/places/${id}`;
            method = "PATCH";
        }

        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Error en la petición");

        resetForm();
        loadPlaces();
    } catch (error) {
        console.error(error);
        alert("Ocurrió un error al guardar.");
    }
});

btnCancel.addEventListener("click", resetForm);

function resetForm() {
    form.reset();
    document.getElementById("place-id").value = "";
    document.getElementById("lat").value = "";
    document.getElementById("lng").value = "";
    document.getElementById("lat-display").textContent = "-";
    document.getElementById("lng-display").textContent = "-";
    document.querySelector("h3").textContent = "Registrar Lugar";
    btnSave.textContent = "Guardar";
    btnCancel.style.display = "none";
    
    if (currentMarker) {
        map.removeLayer(currentMarker);
        currentMarker = null;
    }
}

async function loadPlaces() {
    try {
        const res = await fetch("/places");
        const places = await res.json();
        
    
        const tbody = document.getElementById("places-table-body");
        tbody.innerHTML = "";
        
    
        Object.values(markers).forEach(marker => map.removeLayer(marker));
        markers = {};

        places.forEach(place => {
            renderPlaceInTable(place, tbody);
            renderPlaceOnMap(place);
        });
    } catch (error) {
        console.error("Error cargando lugares:", error);
    }
}

function renderPlaceOnMap(place) {
    const [lng, lat] = place.location.coordinates;
    const marker = L.marker([lat, lng]).addTo(map)
        .bindPopup(`<strong>${place.name}</strong><br>${place.description}`);
    
    markers[place._id] = marker;
}

function renderPlaceInTable(place, tbody) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${place.name}</td>
        <td>${place.description}</td>
        <td>
            <button class="btn-action btn-edit" onclick="startEdit('${place._id}')">Editar</button>
            <button class="btn-action btn-delete" onclick="deletePlace('${place._id}')">Borrar</button>
        </td>
    `;
    tbody.appendChild(tr);
}

window.startEdit = async (id) => {
    try {
        const res = await fetch("/places"); 
        const places = await res.json();
        const place = places.find(p => p._id === id);

        if (!place) return;

        const [lng, lat] = place.location.coordinates;

    
        document.getElementById("place-id").value = place._id;
        document.getElementById("name").value = place.name;
        document.getElementById("description").value = place.description;
        setFormCoords(lat, lng);

    
        document.querySelector("h3").textContent = "Editar Lugar";
        btnSave.textContent = "Actualizar";
        btnCancel.style.display = "inline-block";
        
    
        map.setView([lat, lng], 15);
        placeTempMarker(lat, lng);

    } catch (error) {
        console.error(error);
    }
};

window.deletePlace = async (id) => {
    if(!confirm("¿Estás seguro de eliminar este lugar?")) return;

    try {
        await fetch(`/places/${id}`, { method: "DELETE" });
        loadPlaces();
        resetForm();
    } catch (error) {
        alert("Error al eliminar");
    }
};

loadPlaces();