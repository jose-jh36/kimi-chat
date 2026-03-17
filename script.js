// Este script te pedirá la clave y la guardará solo en tu móvil
let miClave = localStorage.getItem('mi_clave_nvidia');

if (!miClave) {
    miClave = prompt("⚠️ Pega aquí tu API Key de NVIDIA (nvapi-...):");
    if (miClave) localStorage.setItem('mi_clave_nvidia', miClave);
}

const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

async function enviar() {
    const texto = userInput.value.trim();
    if (!texto || !miClave) return;

    // 1. Mostrar tu mensaje
    crearBurbuja('user', texto);
    userInput.value = '';

    // 2. Mostrar "Pensando..."
    const cargando = crearBurbuja('kimi', "...");

    try {
        const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${miClave}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "meta/llama-3.1-8b-instruct",
                "messages": [{"role": "user", "content": texto}]
            })
        });

        const data = await res.json();
        cargando.remove();

        if (data.choices) {
            crearBurbuja('kimi', data.choices[0].message.content);
        } else {
            crearBurbuja('kimi', "❌ Error: Clave inválida o sin créditos.");
            localStorage.removeItem('mi_clave_nvidia'); // Para que te la pida de nuevo si falló
        }
    } catch (err) {
        cargando.remove();
        crearBurbuja('kimi', "❌ Error de conexión.");
    }
}

function crearBurbuja(tipo, contenido) {
    const div = document.createElement('div');
    div.className = `msg ${tipo}`;
    div.innerText = contenido;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    return div;
}

sendBtn.onclick = enviar;
userInput.onkeypress = (e) => { if(e.key === 'Enter') enviar(); };
