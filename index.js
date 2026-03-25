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
    if (dialInput.value === '*858#') {
        dialInput.value = '';
    }
    dialInput.value += char;
}

function deleteDial() {
    dialInput.value = dialInput.value.slice(0, -1);
}

let ussdState = 0;

const dialog = document.getElementById('ussd-dialog');
const loader = document.getElementById('loading-dialog');
const ussdText = document.getElementById('ussd-text');
const ussdInput = document.getElementById('ussd-input');
const dialerMain = document.getElementById('dialer-main');

function executeWithLoader(callback) {
    dialog.classList.add('hidden');
    dialog.classList.remove('flex');
    dialerMain.classList.add('opacity-0', 'pointer-events-none');
    loader.classList.remove('hidden');
    
    setTimeout(() => {
        loader.classList.add('hidden');
        callback();
    }, 1200);
}

function startUssd() {
    if(dialInput.value === '*858#') {
        ussdState = 1;
        executeWithLoader(() => {
            dialog.classList.remove('hidden');
            dialog.classList.add('flex');
            renderMenu();
        });
    } else if (dialInput.value !== '') {
        alert('Calling ' + dialInput.value + '...');
    }
}

function closeUssd() {
    dialog.classList.add('hidden');
    dialog.classList.remove('flex');
    loader.classList.add('hidden');
    dialerMain.classList.remove('opacity-0', 'pointer-events-none');
    ussdInput.value = '';
    ussdState = 0;
    ussdInput.style.display = 'block';
}

function renderMenu() {
    ussdInput.value = '';
    ussdInput.focus();
    
    switch(ussdState) {
        case 1:
            ussdText.innerHTML = "1.Hot Promo<br>2.Internet Harian<br>3.Internet Mingguan<br>4.Internet Bulanan<br>5.Combo Internet + Telpon<br>6.Paket Malam<br>7.Paket Game & Streaming<br>8.Cek Pulsa<br>9.Cek Kuota";
            ussdInput.style.display = 'block';
            break;
        case 11:
            ussdText.innerHTML = "<b>Hot Promo 15GB / Rp 30.000</b><br>1. Beli<br>9. Back";
            break;
        case 12:
            ussdText.innerHTML = "<b>Paket Internet Harian</b><br>1. 1GB/Rp5rb<br>2. 3GB/Rp10rb<br>9. Back";
            break;
        case 13:
            ussdText.innerHTML = "<b>Paket Internet Mingguan</b><br>1. 5GB/Rp20rb<br>2. 10GB/Rp30rb<br>9. Back";
            break;
        case 14:
            ussdText.innerHTML = "<b>Paket Internet Bulanan</b><br>1. 20GB/Rp60rb<br>2. 50GB/Rp100rb<br>9. Back";
            break;
        case 15:
            ussdText.innerHTML = "<b>Combo Internet + Telpon</b><br>1. 15GB + 100Mnt / Rp75rb<br>9. Back";
            break;
        case 16:
            ussdText.innerHTML = "<b>Paket Malam (00-06)</b><br>1. 10GB/Rp15rb<br>9. Back";
            break;
        case 17:
            ussdText.innerHTML = "<b>Paket Game & Streaming</b><br>1. 5GB/Rp25rb<br>9. Back";
            break;
        case 18:
            ussdText.innerHTML = "<b>Informasi Pulsa</b><br>Sisa Pulsa Anda Rp 150.000. Aktif s/d 31-12-2026.<br>0. Home";
            break;
        case 19:
            ussdText.innerHTML = "<b>Informasi Kuota</b><br>Sisa Kuota Internet Anda 12.5 GB. Berlaku s/d 31-12-2026.<br>0. Home";
            break;
        case 20:
            ussdText.innerHTML = "<b>Terima kasih</b><br>Permintaan Anda sedang diproses. Tunggu SMS notifikasi selanjutnya.";
            ussdInput.style.display = 'none';
            break;
        default:
            ussdState = 1;
            renderMenu();
            return;
    }
}

function handleUssdSubmit() {
    const input = ussdInput.value.trim();

    executeWithLoader(() => {
        if (ussdState === 1) {
            if (input === '1') ussdState = 11;
            else if (input === '2') ussdState = 12;
            else if (input === '3') ussdState = 13;
            else if (input === '4') ussdState = 14;
            else if (input === '5') ussdState = 15;
            else if (input === '6') ussdState = 16;
            else if (input === '7') ussdState = 17;
            else if (input === '8') ussdState = 18;
            else if (input === '9') ussdState = 19;
        } else if (ussdState >= 11 && ussdState <= 17) {
            if (input === '9') {
                ussdState = 1;
            } else if (input !== '') {
                ussdState = 20;
            }
        } else if (ussdState === 18 || ussdState === 19) {
            if (input === '0') {
                ussdState = 1;
            } else {
                closeUssd();
                return;
            }
        } else if (ussdState === 20) {
            closeUssd();
            return;
        }
        
        dialog.classList.remove('hidden');
        dialog.classList.add('flex');
        renderMenu();
    });
}

ussdInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        handleUssdSubmit();
    }
});
