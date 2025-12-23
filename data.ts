
import { AppData, PolicySection } from './types';

const commonPrivacyPolicy: PolicySection[] = [
  {
    title: { en: "1. Data Collection", tr: "1. Toplanan Veriler" },
    content: { 
      en: "We collect anonymous usage data to improve our services. Personal information is only collected with your explicit consent.", 
      tr: "Hizmet kalitesini artırmak amacıyla anonim kullanım verileri topluyoruz. Kişisel bilgiler sadece açık rızanızla toplanır." 
    }
  },
  {
    title: { en: "2. Usage of Data", tr: "2. Verilerin Kullanımı" },
    content: {
      en: "Data is used to personalize the app experience and fix technical issues. We never sell your data to third parties.",
      tr: "Veriler uygulama deneyimini kişiselleştirmek ve teknik sorunları gidermek için kullanılır. Verileriniz asla üçüncü şahıslara satılmaz."
    }
  },
  {
    title: { en: "3. Data Security", tr: "3. Veri Güvenliği" },
    content: {
      en: "We use industry-standard encryption to protect your data during transmission and storage.",
      tr: "Verilerinizi iletim ve depolama sırasında korumak için endüstri standardı şifreleme yöntemleri kullanıyoruz."
    }
  },
  {
    title: { en: "4. Contact Us", tr: "4. İletişim" },
    content: {
      en: "If you have questions about this policy, please contact support.",
      tr: "Bu politika hakkında sorularınız varsa lütfen destek ekibiyle iletişime geçin."
    }
  }
];

export const initialAppsData: AppData[] = [
  {
    id: 'fittrack-pro',
    name: 'FitTrack Pro',
    tagline: {
      en: 'Your Personal Health & Fitness Coach',
      tr: 'Kişisel Sağlık ve Fitness Koçunuz'
    },
    description: {
      en: 'Achieve your goals with FitTrack Pro. Track daily activities, count calories, and stay fit with personalized workout plans.',
      tr: 'FitTrack Pro ile hedeflerinize ulaşın. Günlük aktivitelerinizi takip edin, kalori sayın ve kişiselleştirilmiş antrenman planları ile formda kalın.'
    },
    category: { en: 'Health & Fitness', tr: 'Sağlık & Fitness' },
    rating: 4.8,
    reviewsCount: 12450,
    version: '2.4.1',
    lastUpdated: { en: 'Oct 15, 2023', tr: '15 Ekim 2023' },
    downloadLink: '#',
    iconUrl: 'https://picsum.photos/id/111/200/200',
    screenshots: [
      'https://picsum.photos/id/40/300/600',
      'https://picsum.photos/id/41/300/600',
      'https://picsum.photos/id/42/300/600',
      'https://picsum.photos/id/43/300/600',
    ],
    features: [
      {
        title: { en: 'Activity Tracking', tr: 'Aktivite Takibi' },
        description: { en: 'Automatically track steps, calories burned, and distance traveled.', tr: 'Adımlarınızı, yaktığınız kalorileri ve kat ettiğiniz mesafeyi otomatik olarak takip edin.' },
        iconName: 'Activity',
      },
      {
        title: { en: 'Heart Health', tr: 'Kalp Sağlığı' },
        description: { en: 'Monitor cardiovascular health with heart rate analysis.', tr: 'Kalp atış hızı analizi ile kardiyovasküler sağlığınızı kontrol altında tutun.' },
        iconName: 'Heart',
      },
      {
        title: { en: 'Detailed Reports', tr: 'Detaylı Raporlar' },
        description: { en: 'Visualize progress with weekly and monthly charts.', tr: 'Haftalık ve aylık grafiklerle ilerlemenizi görselleştirin.' },
        iconName: 'BarChart3',
      }
    ],
    privacyPolicy: [
      ...commonPrivacyPolicy,
      {
        title: { en: "5. Health Data", tr: "5. Sağlık Verileri" },
        content: {
          en: "FitTrack Pro integrates with HealthKit to sync your activity data locally on your device. This data is not sent to our servers.",
          tr: "FitTrack Pro, aktivite verilerinizi cihazınızda yerel olarak senkronize etmek için HealthKit ile entegre çalışır. Bu veriler sunucularımıza gönderilmez."
        }
      }
    ]
  },
  {
    id: 'mindful-moments',
    name: 'Mindful Moments',
    tagline: {
      en: 'Daily Meditation & Sleep Assistant',
      tr: 'Günlük Meditasyon ve Uyku Asistanı'
    },
    description: {
      en: 'Relax after a stressful day. Mindful Moments supports your mental health with guided meditations, sleep stories, and breathing exercises.',
      tr: 'Stresli bir günden sonra rahatlayın. Mindful Moments, rehberli meditasyonlar, uyku hikayeleri ve nefes egzersizleri ile zihinsel sağlığınızı destekler.'
    },
    category: { en: 'Lifestyle', tr: 'Yaşam Tarzı' },
    rating: 4.9,
    reviewsCount: 8320,
    version: '1.2.0',
    lastUpdated: { en: 'Nov 1, 2023', tr: '1 Kasım 2023' },
    downloadLink: '#',
    iconUrl: 'https://picsum.photos/id/145/200/200',
    screenshots: [
      'https://picsum.photos/id/50/300/600',
      'https://picsum.photos/id/51/300/600',
      'https://picsum.photos/id/52/300/600',
      'https://picsum.photos/id/53/300/600',
    ],
    features: [
      {
        title: { en: 'Nature Sounds', tr: 'Doğa Sesleri' },
        description: { en: 'Fall asleep to high-quality rain, forest, and ocean sounds.', tr: 'Yüksek kaliteli yağmur, orman ve okyanus sesleri ile uykuya dalın.' },
        iconName: 'CloudRain',
      },
      {
        title: { en: 'Focus Mode', tr: 'Odaklanma Modu' },
        description: { en: 'Boost productivity with Pomodoro technique and focus music.', tr: 'Pomodoro tekniği ve odak müzikleri ile verimliliğinizi artırın.' },
        iconName: 'Zap',
      },
      {
        title: { en: 'Safe Space', tr: 'Güvenli Alan' },
        description: { en: 'Your personal data is encrypted and kept safe on your device.', tr: 'Kişisel verileriniz cihazınızda şifrelenir ve güvende tutulur.' },
        iconName: 'Shield',
      }
    ],
    privacyPolicy: [
      ...commonPrivacyPolicy,
       {
        title: { en: "5. Audio Analytics", tr: "5. Ses Analitiği" },
        content: {
          en: "We analyze listening patterns to recommend better content. No voice data is ever recorded.",
          tr: "Daha iyi içerik önermek için dinleme alışkanlıklarını analiz ediyoruz. Hiçbir ses verisi asla kaydedilmez."
        }
      }
    ]
  },
  {
    id: 'secure-vault',
    name: 'Secure Vault',
    tagline: {
      en: 'Your Digital Security Shield',
      tr: 'Dijital Güvenlik Kalkanınız'
    },
    description: {
      en: 'Store your passwords, private notes, and photos with military-grade encryption. Access your data only with biometric login.',
      tr: 'Parolalarınızı, özel notlarınızı ve fotoğraflarınızı askeri düzeyde şifreleme ile saklayın. Biyometrik giriş ile verilerinize sadece siz ulaşın.'
    },
    category: { en: 'Utilities', tr: 'Araçlar' },
    rating: 4.7,
    reviewsCount: 5100,
    version: '3.0.5',
    lastUpdated: { en: 'Sep 20, 2023', tr: '20 Eylül 2023' },
    downloadLink: '#',
    iconUrl: 'https://picsum.photos/id/160/200/200',
    screenshots: [
      'https://picsum.photos/id/60/300/600',
      'https://picsum.photos/id/61/300/600',
      'https://picsum.photos/id/62/300/600',
      'https://picsum.photos/id/63/300/600',
    ],
    features: [
      {
        title: { en: 'AES-256 Encryption', tr: 'AES-256 Şifreleme' },
        description: { en: 'Your data is protected by industry-standard encryption algorithms.', tr: 'Verileriniz endüstri standardı şifreleme algoritmaları ile korunur.' },
        iconName: 'Lock',
      },
      {
        title: { en: 'Cloud Backup', tr: 'Bulut Yedekleme' },
        description: { en: 'Encrypted backups ensure you never lose data even if you change devices.', tr: 'Şifreli yedekleriniz sayesinde cihaz değiştirseniz bile verileriniz kaybolmaz.' },
        iconName: 'Globe',
      },
      {
        title: { en: 'Cross Platform', tr: 'Çapraz Platform' },
        description: { en: 'Works in sync across all your devices via iOS, Android, and Web.', tr: 'iOS, Android ve Web üzerinden tüm cihazlarınızla senkronize çalışır.' },
        iconName: 'Smartphone',
      }
    ],
    privacyPolicy: [
      ...commonPrivacyPolicy,
      {
        title: { en: "5. Zero Knowledge", tr: "5. Sıfır Bilgi" },
        content: {
          en: "We use Zero Knowledge architecture. We cannot see your passwords or stored files even if we wanted to.",
          tr: "Sıfır Bilgi mimarisi kullanıyoruz. İstesek bile şifrelerinizi veya saklanan dosyalarınızı göremeyiz."
        }
      }
    ]
  }
];
