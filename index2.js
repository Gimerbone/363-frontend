const mainView = document.getElementById('main-view');
const demoView = document.getElementById('demo-view');

function showDemo() {
    mainView.classList.add('hidden');
    mainView.classList.remove('flex');
    
    demoView.classList.remove('hidden');
    demoView.classList.add('flex');
    window.scrollTo(0, 0);
}

function hideDemo() {
    demoView.classList.add('hidden');
    demoView.classList.remove('flex');
    
    mainView.classList.remove('hidden');
    mainView.classList.add('flex');
    closeUssd();
    window.scrollTo(0, 0);
}

const dialInput = document.getElementById('dial-input');

function appendDial(char) {
    if (dialInput.value === '*363#') {
        dialInput.value = '';
    }
    dialInput.value += char;
}

function deleteDial() {
    dialInput.value = dialInput.value.slice(0, -1);
}

let ws = null;
const dialog = document.getElementById('ussd-dialog');
const loader = document.getElementById('loading-dialog');
const ussdText = document.getElementById('ussd-text');
const ussdInput = document.getElementById('ussd-input');
const dialerMain = document.getElementById('dialer-main');

function showLoaderUI() {
    dialog.classList.add('hidden');
    dialog.classList.remove('flex');
    dialerMain.classList.add('opacity-0', 'pointer-events-none');
    loader.classList.remove('hidden');
}

function startUssd() {
    if (dialInput.value === '*363#') {
        showLoaderUI();
        initWebSocket();
    } else if (dialInput.value !== '') {
        alert('Calling ' + dialInput.value + '...');
    }
}

function initWebSocket() {
    ws = new WebSocket('ws://localhost:8080/api/v1/ussd');

    ws.onopen = () => {
        ws.send(JSON.stringify({ option: 0 }));
    };

    ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        renderWsMenu(response);
    };

    ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
        loader.classList.add('hidden');
        dialog.classList.remove('hidden');
        dialog.classList.add('flex');
        ussdText.innerHTML = "<b>Connection Error</b><br>Gagal terhubung ke server.";
        
        ussdInput.style.display = 'none';
        
        btnNormal.classList.add('hidden');
        btnNormal.classList.remove('flex');
        btnEnd.classList.remove('hidden');
        btnEnd.classList.add('flex');
    };

    ws.onclose = () => {
        console.log("WebSocket connection closed.");
    };
}

const btnNormal = document.getElementById('btn-normal');
const btnEnd = document.getElementById('btn-end');

function renderWsMenu(response) {
    loader.classList.add('hidden');
    dialog.classList.remove('hidden');
    dialog.classList.add('flex');
    
    let displayText = `<b>${response.description}</b><br>`;
    
    if (response.menu && response.menu.length > 0) {
        response.menu.forEach((item, index) => {
            displayText += `${index + 1}. ${item}<br>`;
        });
    }
    
    ussdText.innerHTML = displayText;

    if (response.end) {
        ussdInput.style.display = 'none'; 
        btnNormal.classList.add('hidden');
        btnNormal.classList.remove('flex');
        btnEnd.classList.remove('hidden');
        btnEnd.classList.add('flex');
        
        if (ws) ws.close();
    } else {
        ussdInput.style.display = 'block';
        btnEnd.classList.add('hidden');
        btnEnd.classList.remove('flex');
        btnNormal.classList.remove('hidden');
        btnNormal.classList.add('flex');
        
        ussdInput.value = '';
        ussdInput.focus();
    }
}

function closeUssd() {
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

function handleUssdSubmit() {
    const input = ussdInput.value.trim();
    if (!input) return;

    showLoaderUI();

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ option: parseInt(input, 10) }));
    } else {
        closeUssd();
        alert("Koneksi terputus. Silakan coba lagi.");
    }
}

ussdInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        handleUssdSubmit();
    }
});