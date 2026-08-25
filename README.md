# UNPAM Agenda

> **Platform Kalender Akademik Interaktif Universitas Pamulang**  
> Pantau jadwal perkuliahan, masa registrasi, pembayaran kuliah, pekan ujian (UTS/UAS), tugas dosen, dan hari libur secara terstruktur, cepat, dan responsif.

---

## Fitur Utama

- **Timeline Real-Time & Status Otomatis**: Menampilkan agenda aktif (_Sedang Berlangsung_), _Akan Datang_, dan _Telah Selesai_ dengan kalkulasi sisa hari dan progres periode.
- **Pencarian Cepat & Filter Multi-Kategori**: Pencarian teks dengan _debouncing_ (shortcut `/`) dan filter kategori (PMB, Pembayaran & Registrasi, Perkuliahan, UTS/UAS, Tugas Dosen, Libur, Umum).
- **Bookmark & Favorit**: Simpan agenda penting secara lokal (_localStorage_) untuk akses instan.
- **Ekspor Kalender**: Ekspor 1-klik seluruh agenda ke format standar `.ics` (kompatibel dengan Apple Calendar, Google Calendar, Outlook) dan link instan ke Google Calendar per kegiatan.
- **Mode Terang & Gelap**: Deteksi otomatis preferensi sistem (`prefers-color-scheme`) dengan opsi switcher manual.
- **Performa Tinggi & Ramah Aksesibilitas**: Waktu muat instan (_0ms latency initial render_), virtualisasi render `content-visibility: auto`, serta kepatuhan penuh standar aksesibilitas WCAG AAA.
- **PWA & Dukungan Offline**: Siap diinstal sebagai aplikasi Web (_Progressive Web App_) pada perangkat desktop dan seluler.

---

## Teknologi & Arsitektur

| Kategori             | Teknologi                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **Core Framework**   | [Preact](https://preactjs.com/) (10.x) + Preact Iso                                      |
| **State Management** | [@preact/signals](https://preactjs.com/guide/v10/signals/) (Fine-grained reactive state) |
| **Styling & UI**     | [TailwindCSS v4](https://tailwindcss.com/) + [DaisyUI v5](https://daisyui.com/)          |
| **Icons**            | [Lucide Icons](https://lucide.dev/) (`lucide-preact`)                                    |
| **Date & Time**      | [Day.js](https://day.js.org/) (Locale Indonesia & Timezone Asia/Jakarta)                 |
| **Build Tool**       | [Vite](https://vitejs.dev/)                                                              |
| **Package Manager**  | [pnpm](https://pnpm.io/)                                                                 |

---

## Struktur Proyek

```text
unpam-agenda/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Otomasi build & deploy ke GitHub Pages
├── public/
│   ├── icon.png                # Logo resmi aplikasi
│   ├── kalender-akademik.json  # Data kalender akademik statis publik
│   ├── og-image.png            # Open Graph social preview banner (1200x630)
│   ├── site.webmanifest        # Manifest PWA
│   └── sw.js                   # Service Worker PWA
├── src/
│   ├── components/
│   │   ├── common/             # Header, Footer, Control Flow, SEO Head, FAB
│   │   ├── dashboard/          # Cards, Modals, Search Bar, Metrics, Section
│   │   └── views/              # HomeView, NotFoundView
│   ├── context/
│   │   ├── agenda-context.jsx  # State manajemen agenda dengan Preact Signals
│   │   └── theme-context.jsx   # Pengatur tema (Light/Dark)
│   ├── data/
│   │   └── kalender-akademik.json # Sumber data modul kalender akademik
│   ├── utils/
│   │   ├── calendar-export.js  # Generator file .ics dan link Google Calendar
│   │   └── date-helpers.js     # Helper format tanggal & kategori (Day.js)
│   ├── app.jsx                 # Root komponen aplikasi & routing
│   ├── index.css               # Styling global TailwindCSS v4 & tema
│   └── main.jsx                # Entry point aplikasi
├── index.html                  # HTML template dengan SEO & Open Graph meta
├── package.json
└── vite.config.js              # Konfigurasi Vite (Base URL relatif)
```

---

## Panduan Instalasi & Menjalankan Proyek

### 1. Prasyarat

- **Node.js** versi 18 atau lebih baru.
- **pnpm** terpasang (`npm install -g pnpm`).

### 2. Instalasi Dependensi

```bash
pnpm install
```

### 3. Menjalankan Mode Development

```bash
pnpm dev
```

Buka browser di `http://localhost:5173`.

### 4. Build untuk Mode Production

```bash
pnpm build
```

Hasil build siap rilis akan dihasilkan di dalam folder `dist/`.

---

## Deployment (GitHub Pages)

Proyek ini telah dikonfigurasi secara otomatis menggunakan **GitHub Actions** ([`deploy.yml`](.github/workflows/deploy.yml)):

1. Pastikan fitur **GitHub Pages** diaktifkan pada repository Anda:  
   _Settings_ > _Pages_ > _Source: GitHub Actions_.
2. Setiap kali Anda melakukan `git push` ke branch `main`, alur kerja GitHub Actions akan secara otomatis menguji, mem-build, dan mempublikasikan website ke URL GitHub Pages Anda.

---

## Lisensi

Didistribusikan di bawah Lisensi [MIT](LICENSE).
