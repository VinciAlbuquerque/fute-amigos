const API_URL = "http://localhost:3000/partidas";

document.getElementById("form-partida").addEventListener("submit", async (event) => {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const local = document.getElementById("local").value;
    const data = document.getElementById("data").value;
    const horario = document.getElementById("horario").value;

    const partida = { titulo, local, data, horario };

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partida)
    });

    carregarPartidas();
});

async function carregarPartidas() {
    const response = await fetch(API_URL);
    const partidas = await response.json();
    const lista = document.getElementById("lista-partidas");

    lista.innerHTML = "";
    partidas.forEach(partida => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${partida.titulo}</strong> - ${partida.local} - ${partida.data} às ${partida.horario}
            <button onclick="excluirPartida(${partida.id})">Excluir</button>
        `;
        lista.appendChild(li);
    });
}

async function excluirPartida(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    carregarPartidas();
}

carregarPartidas();
