# Analisis Layanan *363# - USSD Web Simulator

Sebuah simulasi interaktif berbasis web untuk layanan USSD `*363#` (Pembelian Paket Internet). Proyek ini dikembangkan sebagai bagian dari **Tugas Implementasi dan Pengujian Perangkat Lunak**.

Aplikasi ini mendemonstrasikan komunikasi *real-time* antara antarmuka *front-end* yang mensimulasikan layar *smartphone* dan *back-end* berbasis WebSocket yang bertindak sebagai penyedia layanan seluler.

## 👥 Tim Pengembang (Hapis Supremacy)
* **M. Hafiz** - Project Manager
* **Dzalfaga D.** - UI/UX Designer
* **Nabil Hilmi** - Front-end Developer
* **Haidar Z.** - Back-end Developer
* **Daffa U.** - Back-end Developer

## 🛠️ Teknologi yang Digunakan
* **Front-end:** HTML5, Vanilla JavaScript, Tailwind CSS (via CDN)
* **Back-end:** Node.js
* **Komunikasi:** WebSockets (`ws` library)

## ✨ Fitur Utama
* **Landing Page:** Halaman perkenalan proyek dan tim.
* **Interactive Dialer:** Antarmuka *dialer* responsif untuk mengetik kode USSD.
* **Real-time USSD Menu:** Navigasi menu USSD interaktif (Promo, Harian, Mingguan, Bulanan, Combo, Malam, Hiburan) yang diproses langsung oleh server.
* **State Management:** Server melacak *state* (posisi menu) pengguna saat menavigasi opsi secara sekuensial.

## 🚀 Cara Instalasi & Menjalankan Aplikasi

### Prasyarat
Pastikan Anda sudah menginstal **Node.js** di komputer Anda.

### 1. Menjalankan Back-end (WebSocket Server)
Buka terminal/command prompt di direktori proyek ini, lalu jalankan perintah berikut:

```bash
# Instalasi dependensi (hanya perlu dilakukan sekali)
npm install ws

# Jalankan server lokal
node server.js

Server akan berjalan dan mendengarkan koneksi di ws://localhost:8080/api/v1/ussd.
```
### 2. Menjalankan Front-end (Client)
* Buka file index.html langsung melalui browser Anda atau (Disarankan) gunakan ekstensi seperti Live Server di VS Code agar lebih optimal.
* Klik tombol "Start Demo", ketik *363# pada layar dialer, lalu tekan tombol panggil.

### 3. Format Komunikasi WebSocket
* Aplikasi ini menggunakan format JSON sederhana untuk bertukar data antara client dan server.

Format Request (Client ke Server):
```bash
JSON

{
  "option": 1
}
```
*(Catatan: option: 0 digunakan sebagai trigger awal saat memanggil 363#)

Format Response (Server ke Client):
```bash
JSON

{
  "description": "Hot Promo Spesial Untuk Anda",
  "menu": [
    "5GB / 3 Hari - Rp10.000",
    "10GB / 7 Hari - Rp20.000",
    "Back"
  ],
  "end": false
}
```
* description: Teks header/judul menu USSD.
* menu: Array berisi daftar opsi paket yang bisa dipilih.
* end: Bernilai true jika sesi USSD telah selesai (misal: setelah berhasil membeli paket), yang akan memicu penutupan dialog dan koneksi.

📄 Lisensi

Hak Cipta © 2026 - Tugas Implementasi dan Pengujian Perangkat Lunak.
