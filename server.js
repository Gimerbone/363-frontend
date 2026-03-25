const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080, path: '/api/v1/ussd' });

console.log('Mock Server USSD berjalan di ws://localhost:8080/api/v1/ussd');

wss.on('connection', (ws) => {
    console.log('Client connected!');
    
    let currentStep = 0;
    let lastMenuCount = 0; 

    ws.on('message', (message) => {
        try {
            const request = JSON.parse(message);
            const option = request.option;
            
            let response = {
                description: "",
                menu: [],
                end: false
            };

            if (currentStep === 0) {
                response.description = "Menu Utama *363#";
                response.menu = [
                    "Hot Promo", "Internet Harian", "Internet Mingguan", 
                    "Internet Bulanan", "Combo Internet + Telpon", 
                    "Paket Malam", "Paket Game & Streaming", 
                    "Cek Pulsa", "Cek Kuota"
                ];
                currentStep = 1;
            } 
            else if (currentStep === 1) {
                if (option === 1) {
                    response.description = "Hot Promo Spesial Untuk Anda";
                    response.menu = [
                        "5GB / 3 Hari - Rp10.000", 
                        "10GB / 7 Hari - Rp20.000",
                        "20GB / 30 Hari - Rp45.000",
                        "Surprise Deal (Random Promo)",
                        "Back"
                    ];
                    currentStep = 11;
                } else if (option === 2) {
                    response.description = "Paket Internet Harian";
                    response.menu = [
                        "500MB / 1 Hari - Rp2.000", 
                        "1GB / 1 Hari - Rp3.500",
                        "2GB / 1 Hari - Rp5.000",
                        "Back"
                    ];
                    currentStep = 12;
                } else if (option === 3) {
                    response.description = "Paket Internet Mingguan";
                    response.menu = [
                        "5GB / 7 Hari - Rp15.000", 
                        "10GB / 7 Hari - Rp25.000", 
                        "15GB / 7 Hari - Rp35.000", 
                        "Back"
                    ];
                    currentStep = 13;
                } else if (option === 4) {
                    response.description = "Paket Internet Bulanan";
                    response.menu = [
                        "10GB / 30 Hari - Rp40.000", 
                        "25GB / 30 Hari - Rp75.000", 
                        "50GB / 30 Hari - Rp120.000", 
                        "Back"
                    ];
                    currentStep = 14;
                } else if (option === 5) {
                    response.description = "Paket Combo";
                    response.menu = [
                        "10GB + 100 Menit Telpon - Rp50.000", 
                        "20GB + 200 Menit Telpon - Rp85.000", 
                        "30GB + Unlimited Telpon Sesama - Rp120.000", 
                        "Back"
                    ];
                    currentStep = 15;
                } else if (option === 6) {
                    response.description = "Paket Internet Malam";
                    response.menu = [
                        "5GB / 7 Hari - Rp10.000", 
                        "10GB / 30 Hari - Rp20.000", 
                        "20GB / 30 Hari - Rp35.000", 
                        "Back"
                    ];
                    currentStep = 16;
                } else if (option === 7) {
                    response.description = "Paket Hiburan";
                    response.menu = [
                        "5GB Gaming + 2GB Utama - Rp15.000", 
                        "10GB Streaming + 5GB Utama - Rp30.000", 
                        "Unlimited Game Popular - Rp20.000", 
                        "Back"
                    ];
                    currentStep = 17;
                } else if (option === 8) {
                    response.description = "Sisa Pulsa Anda Rp 150.000. Aktif s/d 31-12-2026.";
                    response.menu = ["Home"];
                    currentStep = 18;
                } else if (option === 9) {
                    response.description = "Sisa Kuota Internet Anda 12.5 GB. Berlaku s/d 31-12-2026.";
                    response.menu = ["Home"];
                    currentStep = 18;
                } else {
                    response.description = "Pilihan tidak tersedia.";
                    response.menu = ["Home"];
                    currentStep = 18;
                }
            }
            else if (currentStep >= 11 && currentStep <= 17) {
                if (option === lastMenuCount || option === 9) { 
                    response.description = "Menu Utama *363#";
                    response.menu = [
                        "Hot Promo", "Internet Harian", "Internet Mingguan", 
                        "Internet Bulanan", "Combo Internet + Telpon", 
                        "Paket Malam", "Paket Game & Streaming", 
                        "Cek Pulsa", "Cek Kuota"
                    ];
                    currentStep = 1;
                } else if (option > 0 && option < lastMenuCount) {
                    response.description = "Terima kasih. Permintaan Anda sedang diproses. Tunggu SMS notifikasi selanjutnya.";
                    response.end = true;
                } else {
                    response.description = "Pilihan tidak valid.";
                    response.menu = ["Home"];
                    currentStep = 18;
                }
            }
            else if (currentStep === 18) {
                response.description = "Menu Utama *363#";
                response.menu = [
                    "Hot Promo", "Internet Harian", "Internet Mingguan", 
                    "Internet Bulanan", "Combo Internet + Telpon", 
                    "Paket Malam", "Paket Game & Streaming", 
                    "Cek Pulsa", "Cek Kuota"
                ];
                currentStep = 1;
            }

            lastMenuCount = response.menu.length;

            ws.send(JSON.stringify(response));

            if (response.end) {
                ws.close();
            }

        } catch (error) {
            console.error("Error parsing message:", error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});