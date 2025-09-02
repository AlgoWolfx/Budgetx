# Katkıda Bulunma Rehberi

LifeManagement projesine katkıda bulunduğunuz için teşekkür ederiz! Bu rehber, projemize nasıl katkıda bulunabileceğinizi açıklar.

## 🚀 Nasıl Başlarım?

### 1. Projeyi Fork Edin
- GitHub'da projeyi fork edin
- Fork ettiğiniz repo'yu yerel makinenize klonlayın

```bash
git clone https://github.com/kullaniciadi/lifemanagement-budget.git
cd lifemanagement-budget
```

### 2. Geliştirme Ortamını Kurun
```bash
npm install
npm run dev
```

### 3. Branch Oluşturun
```bash
git checkout -b feature/yeni-ozellik-adi
```

## 📋 Katkı Türleri

### 🐛 Bug Raporu
Bir hata buldunuz? Lütfen aşağıdaki bilgileri içeren bir issue açın:
- Hatanın açık tanımı
- Hatayı yeniden oluşturma adımları
- Beklenen davranış
- Ekran görüntüleri (varsa)
- Tarayıcı ve işletim sistemi bilgileri

### ✨ Özellik Önerisi
Yeni bir özellik önerisi için:
- Özelliğin açık tanımı
- Neden gerekli olduğu
- Nasıl çalışması gerektiği
- Örnekler veya mockup'lar (varsa)

### 🔧 Kod Katkısı
Kod katkısı için:
1. Issue açın veya mevcut bir issue'yu seçin
2. Branch oluşturun
3. Kodunuzu yazın
4. Test edin
5. Pull Request açın

## 📝 Kod Standartları

### TypeScript
- Strict mode kullanın
- Tüm prop'ları tip tanımı ile belirtin
- Interface'leri types/ klasöründe tanımlayın

### React Bileşenleri
```typescript
// ✅ Doğru
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};

// ❌ Yanlış
export const Button = (props: any) => {
  return <button onClick={props.onClick}>{props.label}</button>;
};
```

### CSS/Tailwind
- Tailwind CSS utility sınıflarını kullanın
- Responsive tasarım için mobile-first yaklaşım
- Dark mode desteği için theme variables kullanın

```tsx
// ✅ Doğru
<div className="p-4 bg-background border border-border rounded-lg md:p-6">
  <h2 className="text-lg font-semibold text-foreground mb-2">Başlık</h2>
</div>

// ❌ Yanlış
<div style={{padding: '16px', backgroundColor: '#ffffff'}}>
  <h2>Başlık</h2>
</div>
```

### State Management
- Zustand store pattern'ini takip edin
- State'i atomik parçalara bölün
- Side effect'ler için useEffect kullanın

## 🧪 Test Etme

### Manuel Test
- Tüm özelliklerin çalıştığından emin olun
- Responsive tasarımı test edin
- Dark/Light mode geçişini test edin
- Farklı tarayıcılarda test edin

### Kod Kalitesi
```bash
# Linting
npm run lint

# Build test
npm run build
```

## 📤 Pull Request Süreci

### PR Hazırlığı
1. Kodunuzun lint kurallarına uygun olduğundan emin olun
2. Yaptığınız değişiklikleri test edin
3. Commit mesajlarınızı anlamlı yazın

### Commit Mesajları
```bash
# ✅ Doğru
git commit -m "feat: kategori filtreleme özelliği eklendi"
git commit -m "fix: tema geçişinde tooltip sorunu düzeltildi"
git commit -m "docs: README'de kurulum adımları güncellendi"

# ❌ Yanlış
git commit -m "düzeltme"
git commit -m "kod güncellendi"
```

### PR Şablonu
Pull Request açarken aşağıdaki şablonu kullanın:

```markdown
## 📝 Açıklama
Bu PR'ın ne yaptığını kısaca açıklayın.

## 🔗 İlgili Issue
- Closes #123

## 🧪 Test
- [ ] Manuel test yapıldı
- [ ] Responsive tasarım test edildi
- [ ] Dark/Light mode test edildi
- [ ] Cross-browser test yapıldı

## 📷 Ekran Görüntüleri
(Varsa ekran görüntüleri ekleyin)

## ✅ Checklist
- [ ] Kod lint kurallarına uygun
- [ ] TypeScript hataları yok
- [ ] Build başarılı
- [ ] Mevcut testler geçiyor
```

## 🎯 İyi Katkı Örnekleri

### Küçük İyileştirmeler
- Typo düzeltmeleri
- Accessibility iyileştirmeleri
- Performance optimizasyonları
- UI/UX iyileştirmeleri

### Orta Seviye
- Yeni bileşenler
- Mevcut özellikleri genişletme
- Bug düzeltmeleri
- Test coverage artırma

### Büyük Özellikler
- Yeni sayfa/modül ekleme
- Yeni chart türleri
- Export/Import özellikleri
- Gelişmiş filtreleme

## 🚫 Kabul Edilmeyecek Katkılar

- Güvenlik açıkları yaratan kodlar
- Performansı önemli ölçüde düşüren değişiklikler
- Mevcut API'yi bozan değişiklikler
- Kod standartlarına uymayan katkılar
- Test edilmemiş kodlar

## 🤝 Davranış Kuralları

- Saygılı ve yapıcı iletişim kurun
- Farklı görüşlere açık olun
- Öğrenmeye ve öğretmeye istekli olun
- İnklusif dil kullanın
- Issue'larda ve PR'larda net ve açık yazın

## 🆘 Yardıma İhtiyacınız mı Var?

- GitHub Issues'da soru sorun
- Tartışma kısmını kullanın
- Dokümantasyonu kontrol edin
- Mevcut kodları inceleyin

## 🎉 Teşekkürler!

Her katkı, küçük veya büyük, çok değerlidir. Projemizi daha iyi hale getirmeye yardım ettiğiniz için teşekkürler!