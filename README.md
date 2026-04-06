# Health Tracker 🫀

> Aplikasi pencatat kesehatan untuk ibu — karena setiap catatan adalah bentuk cinta.

Health Tracker adalah aplikasi sederhana yang membantu anak-anak merawat orang tua dengan mencatat gula darah, tekanan darah, dan riwayat kesehatan harian. Dibangun dengan Next.js, TypeScript, Tailwind CSS, dan Supabase.

🔗 **Live Demo:** [health-tracker.vercel.app](https://health-tracker-ln03ss2ys-fitriadamayanti12s-projects.vercel.app/)

---

## 📌 Latar Belakang

Aplikasi ini lahir dari pengalaman pribadi merawat ibu yang memiliki diabetes. Gula darahnya pernah mencapai 372 mg/dL — saat itu saya sadar bahwa mencatat kesehatan secara rutin bukan hanya penting, tapi bisa menyelamatkan nyawa.

Health Tracker adalah solusi untuk anak-anak yang:
- Merawat orang tua dengan penyakit kronis
- Ingin memantau tren kesehatan secara sederhana
- Membutuhkan catatan riwayat yang mudah diakses

---

## ✨ Fitur

| Fitur | Status | Keterangan |
|-------|--------|-------------|
| Catat gula darah | ✅ Tersedia | Input cepat nilai harian |
| Catat tekanan darah | ✅ Tersedia | Sistolik dan diastolik |
| Dashboard riwayat | ✅ Tersedia | 10 catatan terbaru |
| Halaman riwayat lengkap | ✅ Tersedia | Semua catatan dalam satu halaman |
| Grafik tren gula darah | 🚧 Rencana | Visualisasi data |
| Pengingat jadwal obat | 🚧 Rencana | Notifikasi harian |
| Export ke PDF | 🚧 Rencana | Backup riwayat |

---

## 🛠️ Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| **Next.js 15** | React framework dengan App Router |
| **TypeScript** | Type safety dan developer experience |
| **Tailwind CSS** | Styling dan responsive design |
| **Supabase** | PostgreSQL database + API |
| **Vercel** | Hosting dan deployment |

---

## 🚀 Demo & Penggunaan

### Dashboard
- Tampilkan 10 catatan terbaru
- Tombol "Tambah Catatan Baru"
- Tombol "Lihat Riwayat Lengkap"

### Tambah Catatan
- Input gula darah (wajib)
- Input tekanan darah (opsional)
- Catatan tambahan (opsional)

### Riwayat Lengkap
- Semua catatan dari awal
- Urut dari terbaru ke terlama
- Format tanggal Indonesia

---

## 📦 Cara Menjalankan di Lokal

### Prasyarat
- Node.js (v18 atau lebih baru)
- npm atau yarn
- Akun Supabase (gratis)

### Langkah-langkah

```bash
# Clone repository
git clone https://github.com/fitriadamayanti12/health-tracker.git
cd health-tracker

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Isi .env.local dengan kredensial Supabase

# Jalankan development server
npm run dev