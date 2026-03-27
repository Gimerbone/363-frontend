const dialog     = document.getElementById('ussd-dialog');
const loader     = document.getElementById('loading-dialog');
const ussdText   = document.getElementById('ussd-text');
const ussdInput  = document.getElementById('ussd-input');
const dialerMain = document.getElementById('dialer-main');
const btnNormal  = document.getElementById('btn-normal');
const btnEnd     = document.getElementById('btn-end');

const host = import.meta.env.VITE_BACKEND_HOST;
const port = import.meta.env.VITE_BACKEND_PORT;

let ws = null;

// ─── UI Helpers ───────────────────────────────────────────────────────────────

function showLoaderUI() {
    dialog.classList.add('hidden');
    dialog.classList.remove('flex');
    dialerMain.classList.add('opacity-0', 'pointer-events-none');
    loader.classList.remove('hidden');
}

function showDialogUI() {
    loader.classList.add('hidden');
    dialog.classList.remove('hidden');
    dialog.classList.add('flex');
}

function setEndState() {
    ussdInput.style.display = 'none';
    btnNormal.classList.add('hidden');
    btnNormal.classList.remove('flex');
    btnEnd.classList.remove('hidden');
    btnEnd.classList.add('flex');
}

function setInputState() {
    ussdInput.style.display = 'block';
    btnEnd.classList.add('hidden');
    btnEnd.classList.remove('flex');
    btnNormal.classList.remove('hidden');
    btnNormal.classList.add('flex');
    ussdInput.value = '';
    ussdInput.focus();
}

// ─── WebSocket ────────────────────────────────────────────────────────────────
function getWsAddress(type) {
    if (type === "prod") {
        return `wss://${host}/api/v1/ussd`;
    }
    else {
        return `ws://${host}:${port}/api/v1/ussd`;
    }
}

function initWebSocket() {
    ws = new WebSocket(getWsAddress("prod"));

    // This causes break thus should not be called unless modified
    // ws.onopen = () => {
    //     ws.send(JSON.stringify({ option: 0 }));
    // };

    ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        renderWsMenu(response);
    };

    ws.onerror = () => {
        showDialogUI();
        ussdText.innerHTML = '<b>Connection Error</b><br>Gagal terhubung ke server.';
        setEndState();
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed.');
    };
}

function renderWsMenu(response) {
    showDialogUI();

    let displayText = `<b>${response.description}</b><br>`;
    if (response.menu?.length > 0) {
        response.menu.forEach((item, index) => {
            displayText += `${index + 1}. ${item}<br>`;
        });
    }
    ussdText.innerHTML = displayText;

    if (response.end) {
        setEndState();
        ws?.close();
    } else {
        setInputState();
    }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function startUssd() {
    showLoaderUI();
    initWebSocket();
}

export function closeUssd() {
    dialog.classList.add('hidden');
    dialog.classList.remove('flex');
    loader.classList.add('hidden');
    dialerMain.classList.remove('opacity-0', 'pointer-events-none');

    ussdInput.value = '';
    ussdInput.style.display = 'block';
    btnEnd.classList.add('hidden');
    btnEnd.classList.remove('flex');
    btnNormal.classList.remove('hidden');
    btnNormal.classList.add('flex');

    if (ws) {
        ws.close();
        ws = null;
    }
}

export function handleUssdSubmit() {
    const input = ussdInput.value.trim();
    if (!input) return;

    showLoaderUI();

    if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ option: parseInt(input, 10) }));
    } else {
        closeUssd();
        alert('Koneksi terputus. Silakan coba lagi.');
    }
}

// ─── Enter key listener ───────────────────────────────────────────────────────

ussdInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleUssdSubmit();
    }
});