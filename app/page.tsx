'use client';

import Link from 'next/link';
import { Shield, Zap, BarChart3, Clock, Users, Award, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: 'Keamanan Terjamin',
      description: 'Data kesehatan Anda dilindungi dengan enkripsi dan autentikasi yang kuat.',
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: 'Cepat & Mudah',
      description: 'Catat gula darah dan tekanan darah dalam hitungan detik.',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-green-500" />,
      title: 'Analisis Lengkap',
      description: 'Lihat tren kesehatan dengan grafik dan statistik yang informatif.',
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-500" />,
      title: 'Riwayat Lengkap',
      description: 'Semua catatan tersimpan rapi dan bisa diakses kapan saja.',
    },
    {
      icon: <Users className="w-6 h-6 text-red-500" />,
      title: 'Berbagi dengan Dokter',
      description: 'Export data ke PDF untuk konsultasi dengan dokter.',
    },
    {
      icon: <Award className="w-6 h-6 text-orange-500" />,
      title: 'Pengingat Cek',
      description: 'Notifikasi rutin untuk tidak lupa cek kesehatan.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Pengguna Aktif' },
    { number: '1000+', label: 'Catatan Kesehatan' },
    { number: '99%', label: 'Kepuasan Pengguna' },
    { number: '24/7', label: 'Akses Online' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navbar */}
      <nav className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Health Tracker
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition shadow-sm">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          Pantau Kesehatan Keluarga
          <br />
          dengan Mudah
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Catat gula darah, tekanan darah, dan gejala sehari-hari. Pantau tren kesehatan dengan grafik dan laporan yang mudah dipahami.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl hover:from-blue-700 hover:to-teal-700 transition shadow-md flex items-center gap-2">
              Mulai Sekarang
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <Link href="#features">
            <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition">
              Pelajari Lebih Lanjut
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-3xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="text-3xl font-bold text-gray-800">{stat.number}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Fitur Lengkap untuk Kesehatanmu</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Semua yang kamu butuhkan untuk memantau kesehatan keluarga dalam satu aplikasi
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Siap Memulai?</h2>
          <p className="text-white opacity-90 mb-8 max-w-xl mx-auto">
            Daftar sekarang dan mulai pantau kesehatan keluarga dengan lebih baik.
          </p>
          <Link href="/signup">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition shadow-md">
              Daftar Gratis
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
          <p>© 2026 Health Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}