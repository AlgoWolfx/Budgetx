# 💰 LifeManagement - Finansal Yönetim Uygulaması

Modern, kullanıcı dostu ve responsive bir kişisel finans yönetim uygulaması. React, TypeScript ve modern web teknolojileri ile geliştirilmiştir.

<div align="center">
  <img src="https://via.placeholder.com/800x400/1f2937/ffffff?text=LifeManagement+Dashboard+Demo" alt="LifeManagement Dashboard Demo" width="800">
  <p><em>Modern ve kullanıcı dostu arayüz</em></p>
</div>

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?logo=vite)
![Build Size](https://img.shields.io/badge/Build_Size-951KB-green)
![Gzip Size](https://img.shields.io/badge/Gzip_Size-261KB-brightgreen)

## 🌟 Özellikler

### 💡 Temel Özellikler
- **📊 Gelir & Gider Takibi**: Aylık gelir ve giderlerinizi detaylı olarak takip edin
- **📈 Grafiksel Analiz**: Harcama kategorileri ve zaman bazlı analiz grafikleri
- **📱 Mobil Uyumlu**: Tüm cihazlarda mükemmel kullanıcı deneyimi
- **🌓 Tema Desteği**: Açık/Koyu tema geçişi
- **💶 Euro Desteği**: Türkiye lokali ile Euro para birimi formatı

### 🚀 Gelişmiş Özellikler
- **⚡ Hızlı Gider Girişi**: Önceden tanımlı şablonlarla hızlı işlem girişi
- **📊 Kategori Bazlı Analiz**: Detaylı kategori performans analizleri
- **📅 Aylık Raporlama**: Kapsamlı aylık finansal raporlar
- **💾 Yerel Depolama**: Verileriniz güvenli şekilde yerel olarak saklanır
- **🔒 Şifre Koruması**: Uygulamaya güvenli erişim

### 🎨 Kullanıcı Deneyimi
- **🎯 Temiz Arayüz**: Modern ve minimal tasarım
- **⚡ Hızlı Performans**: Vite ile optimize edilmiş build süreci
- **📱 Responsive Tasarım**: Mobil-öncelikli yaklaşım
- **🎨 ShadCN UI**: Profesyonel UI bileşenleri

## 🛠️ Teknoloji Stack

### Frontend
- **React 18.3.1** - Modern UI kütüphanesi
- **TypeScript** - Tip güvenli geliştirme
- **Vite** - Hızlı build tool
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Modern UI bileşen kütüphanesi

### State Management & Routing
- **Zustand** - Lightweight state management
- **React Router DOM** - Client-side routing
- **React Query** - Server state management

### Charts & Visualization
- **Recharts** - React chart library
- **Lucide React** - Modern icon library

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript specific linting
- **PostCSS & Autoprefixer** - CSS processing

## 🚀 Kurulum

### Gereksinimler
- Node.js (v18 veya üzeri)
- npm veya yarn package manager

### Projeyi Klonlama
```bash
git clone https://github.com/kullaniciadi/lifemanagement-budget.git
cd lifemanagement-budget
```

### Bağımlılıkları Yükleme
```bash
npm install
# veya
yarn install
```

### Geliştirme Sunucusunu Başlatma
```bash
npm run dev
# veya
yarn dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

## 📦 Build ve Deploy

### Production Build
```bash
npm run build
# veya
yarn build
```

### Preview
```bash
npm run preview
# veya
yarn preview
```

## 🎯 Kullanım

### İlk Giriş
1. Uygulamayı açın
2. Giriş şifresi: `budget123`
3. Ana dashboard'a yönlendirileceksiniz

### Temel İşlemler
1. **Gelir Ekleme**: Üst menüden "Gelir Yönetimi"ne tıklayın
2. **Gider Ekleme**: "Gider Ekle" butonunu kullanın veya hızlı giriş panelini kullanın
3. **Raporları İnceleme**: "Yıllık Rapor" butonuna tıklayın
4. **Kategori Analizi**: Ana sayfadaki kategori kartlarına tıklayın

### Şablonlar
Sık kullanılan giderler için önceden tanımlı şablonlar:
- 🚬 Sigara
- 📄 Sigara Kağıdı
- 🏠 Kira
- 🛒 Market Alışverişi
- 📱 İnternet/Telefon
- 💪 Spor Salonu
- 📺 Netflix/Abonelik

## 📁 Proje Yapısı

```
src/
├── components/          # React bileşenleri
│   ├── ui/             # ShadCN UI bileşenleri
│   ├── AddExpenseModal.tsx
│   ├── CategoryBadges.tsx
│   ├── Charts.tsx
│   ├── ExpenseTable.tsx
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility fonksiyonları
├── pages/              # Sayfa bileşenleri
│   ├── Dashboard.tsx
│   ├── AnnualReport.tsx
│   └── NotFound.tsx
├── store/              # Zustand state management
├── types/              # TypeScript tip tanımları
└── App.tsx             # Ana uygulama bileşeni
```

## 🎨 Tema ve Tasarım

### Tasarım Sistemi
- **Renkler**: CSS custom properties ile tema desteği
- **Tipografi**: Inter font family
- **Spacing**: Tailwind CSS spacing scale
- **Animations**: Tailwind CSS animate utilities

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Yapılandırma

### Özelleştirme
- `tailwind.config.ts` - Tailwind CSS yapılandırması
- `vite.config.ts` - Vite build yapılandırması
- `tsconfig.json` - TypeScript yapılandırması

### Ortam Değişkenleri
Proje şu anda ortam değişkeni gerektirmiyor, tüm veriler yerel depolamada saklanıyor.

## 🤝 Katkıda Bulunma

1. Bu repo'yu fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

### Kod Standartları
- ESLint kurallarına uyun
- TypeScript strict mode kullanın
- Bileşenleri küçük ve yeniden kullanılabilir yapın
- Responsive tasarım prensiplerine uyun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🐛 Bilinen Sorunlar

- Şu anda veriler yalnızca yerel depolamada saklanıyor
- Çoklu kullanıcı desteği bulunmuyor
- Veri yedekleme özelliği mevcut değil

## 🔮 Gelecek Özellikler

- [ ] Cloud sync desteği
- [ ] Çoklu para birimi desteği
- [ ] Veri export/import özelliği
- [ ] Kategori özelleştirme
- [ ] Bütçe hedefleri ve uyarıları
- [ ] PWA desteği

## 📞 İletişim

Sorular, öneriler veya geri bildirimler için:
- GitHub Issues: [Issues](https://github.com/kullaniciadi/lifemanagement-budget/issues)
- Email: kullanici@email.com

## 🙏 Teşekkürler

Bu projeyi mümkün kılan açık kaynak kütüphanelere ve topluluğa teşekkürler:
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Recharts](https://recharts.org/)

---

**Not**: Bu uygulama kişisel finans yönetimi için tasarlanmıştır ve profesyonel finansal danışmanlık yerine geçmez.