# Analisis Layanan \*363# — USSD Web Simulator

Sebuah simulasi interaktif berbasis web untuk layanan USSD `*363#` (Pembelian Paket Internet). Proyek ini dikembangkan sebagai bagian dari **Tugas Implementasi dan Pengujian Perangkat Lunak**.

Aplikasi ini mendemonstrasikan komunikasi *real-time* antara antarmuka *front-end* yang mensimulasikan layar *smartphone* dan *back-end* berbasis WebSocket yang bertindak sebagai penyedia layanan seluler.

---

## 👥 Tim Pengembang — Hapis Supremacy

| Nama | Peran |
|------|-------|
| M. Hafiz | Project Manager |
| Dzalfaga D. | UI/UX Designer |
| Nabil Hilmi | Front-end Developer |
| Haidar Z. | Back-end Developer |
| Daffa U. | Back-end Developer |

---

## 🛠️ Teknologi yang Digunakan

| Lapisan | Teknologi |
|---------|-----------|
| Front-end | HTML5, Vanilla JavaScript (ES Modules), Tailwind CSS (via CDN) |
| Build Tool | [Vite](https://vitejs.dev/) |
| Back-end | Node.js |
| Komunikasi | WebSocket (`ws` library) |

---

## ✨ Fitur Utama

- **Landing Page** — Halaman perkenalan proyek beserta profil tim.
- **Interactive Dialer** — Antarmuka *dialer* responsif yang mensimulasikan layar *smartphone* untuk menginput kode USSD.
- **Real-time USSD Menu** — Navigasi menu USSD interaktif (Promo, Harian, Mingguan, Bulanan, Combo, Malam, Hiburan) yang diproses langsung oleh server.
- **State Management** — Server melacak posisi menu pengguna saat menavigasi opsi secara sekuensial.

---

## 📁 Struktur Proyek

```
project/
├── public/
│   ├── images/              # Aset gambar statis
│   └── helvetica-neue/      # Aset font lokal
├── src/
│   ├── main.js              # Entry point — menghubungkan semua event listener
│   └── js/
│       ├── navigation.js    # Logika perpindahan halaman (main ↔ demo)
│       ├── dialer.js        # Logika input dial pad
│       └── ussd.js          # Koneksi WebSocket & manajemen dialog USSD
├── index.html               # Entry point HTML (Vite)
├── index.css                # Stylesheet global
├── vite.config.js           # Konfigurasi Vite (jika ada)
├── server.js                # WebSocket server (back-end)
└── package.json
```

---

## 🚀 Cara Instalasi & Menjalankan Aplikasi

### Prasyarat

Pastikan **Node.js** (versi 16 atau lebih baru) sudah terinstal di komputer Anda.

---

### 1. Instal Dependensi

Jalankan perintah berikut di direktori proyek untuk menginstal seluruh dependensi (termasuk Vite dan `ws`):

```bash
npm install
```

> Jika belum ada `package.json`, inisialisasi proyek Vite terlebih dahulu:
> ```bash
> npm create vite@latest . -- --template vanilla
> npm install
> npm install ws
> ```

---

### 2. Menjalankan Back-end (WebSocket Server)

Buka terminal baru, lalu jalankan server WebSocket:

```bash
node server.js
```

Server akan aktif dan mendengarkan koneksi di:
```
ws://localhost:8080/api/v1/ussd
```

---

### 3. Menjalankan Front-end (Development Server)

Pada terminal terpisah, jalankan Vite dev server:

```bash
npm run dev
```

Buka browser dan akses URL yang ditampilkan (biasanya `http://localhost:5173`).

Klik tombol **"Start Demo"**, ketik `*363#` pada layar dialer, lalu tekan tombol panggil hijau.

---

### 4. Build untuk Produksi

Untuk menghasilkan *build* yang siap digunakan di lingkungan produksi:

```bash
npm run build
```

Hasil *build* akan tersedia di folder `dist/`. Untuk mem-*preview* hasil *build* secara lokal:

```bash
npm run preview
```

---

## 🔌 Format Komunikasi WebSocket

Aplikasi menggunakan format JSON sederhana untuk bertukar data antara *client* dan *server*.

### Request (Client → Server)

```json
{
  "option": 1
}
```

> `option: 0` digunakan sebagai *trigger* awal saat pertama kali memanggil `*363#`.

### Response (Server → Client)

```json
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

| Field | Tipe | Keterangan |
|-------|------|------------|
| `description` | `string` | Teks header/judul menu USSD yang ditampilkan. |
| `menu` | `string[]` | Daftar opsi yang dapat dipilih pengguna. Kosong jika tidak ada opsi. |
| `end` | `boolean` | `true` jika sesi USSD telah selesai — menutup dialog dan koneksi WebSocket. |

---

## 📄 Lisensi

Hak Cipta © 2026 — Tugas Implementasi dan Pengujian Perangkat Lunak.
