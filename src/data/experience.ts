import type { Locale } from '@/i18n/ui';

type Localized<T = string> = Record<Locale, T>;

export interface Role {
  company: string;
  url?: string;
  title: Localized;
  type: Localized;
  period: Localized;
  current?: boolean;
  highlights: Localized<string[]>;
  tech: string[];
}

export const experience: Role[] = [
  {
    company: 'Zaim Teknopark',
    title: { en: 'R&D Project Evaluator', tr: 'Ar-Ge Proje Değerlendiricisi' },
    type: { en: 'Freelance · Remote', tr: 'Freelance · Remote' },
    period: { en: 'Oct 2026 — Present', tr: 'Eki 2026 — Devam' },
    current: true,
    highlights: {
      en: [
        'Technical due diligence on R&D proposals from technology companies — feasibility, innovation level and eligibility.',
        'Review architecture, stack and delivery plans of backend, cloud and IoT projects; audit progress reports and issue approval or revision recommendations.',
      ],
      tr: [
        'Teknoloji firmalarının Ar-Ge proje başvurularının teknik ön değerlendirmesi: fizibilite, yenilik düzeyi ve uygunluk.',
        'Backend, cloud ve IoT projelerinin mimari, teknoloji yığını ve iş planlarını inceleyip ara/sonuç raporlarına onay veya revizyon önerisi sunuyorum.',
      ],
    },
    tech: ['Architecture review', 'Cloud', 'IoT'],
  },
  {
    company: 'Covalent (CQT)',
    url: 'https://www.covalenthq.com',
    title: { en: 'Backend Developer', tr: 'Backend Developer' },
    type: { en: 'Contract · Remote', tr: 'Sözleşmeli · Remote' },
    period: { en: 'Sep 2025 — Feb 2026', tr: 'Eyl 2025 — Şub 2026' },
    highlights: {
      en: [
        'Built services on the Covalent Unified API serving on-chain data from 10+ blockchain networks.',
        'Shipped a token/NFT marketplace dApp end-to-end: REST API, wallet-based auth, listings and transaction history.',
        'Response caching and request batching cut external API calls by ~40% and average latency by ~35%.',
      ],
      tr: [
        'Covalent Unified API üzerinde 10+ blockchain ağından on-chain veri sunan servisler geliştirdim.',
        'Token/NFT marketplace dApp’ini uçtan uca geliştirdim: REST API, cüzdan tabanlı kimlik doğrulama, listeleme ve işlem geçmişi.',
        'Response caching ve request batching ile harici API çağrılarını ~%40, ortalama gecikmeyi ~%35 azalttım.',
      ],
    },
    tech: ['REST APIs', 'OpenAPI', 'Caching', 'Web3'],
  },
  {
    company: 'Nova UAV Team',
    title: {
      en: 'Software Developer — Computer Vision',
      tr: 'Software Developer — Computer Vision',
    },
    type: { en: 'University R&D Team · Istanbul', tr: 'Üniversite Ar-Ge Takımı · İstanbul' },
    period: { en: 'Nov 2024 — Apr 2025', tr: 'Kas 2024 — Nis 2025' },
    highlights: {
      en: [
        'Real-time image-processing pipeline for UAV camera feeds: preprocessing, colour segmentation and object detection.',
        'Optimised frame processing from ~15 to ~25 FPS on onboard hardware.',
      ],
      tr: [
        'İHA kameraları için gerçek zamanlı görüntü işleme pipeline’ı: ön işleme, renk segmentasyonu ve nesne tespiti.',
        'Frame işlemeyi optimize ederek araç üstü donanımda hızı ~15’ten ~25 FPS’e çıkardım.',
      ],
    },
    tech: ['Python', 'OpenCV'],
  },
  {
    company: 'Teknolojik Çözüm',
    title: {
      en: 'Software Specialist — Backend & DevOps',
      tr: 'Yazılım Uzmanı — Backend & DevOps',
    },
    type: { en: 'Istanbul', tr: 'İstanbul' },
    period: { en: 'Aug 2022 — Apr 2023', tr: 'Ağu 2022 — Nis 2023' },
    highlights: {
      en: [
        'Backend services, REST APIs and admin panels for 5+ corporate clients.',
        'Containerised 10+ services with Docker — deployments went from ~2 hours to ~20 minutes.',
        'Nginx reverse proxy with TLS, GitHub Actions CI/CD and root-cause analysis: ~30% fewer recurring incidents, 99.5%+ uptime.',
      ],
      tr: [
        '5+ kurumsal müşteri için backend servisleri, REST API’ler ve yönetim panelleri geliştirdim.',
        '10+ servisi Docker’a taşıdım; deployment süresi ~2 saatten ~20 dakikaya indi.',
        'TLS’li Nginx reverse proxy, GitHub Actions CI/CD ve kök neden analiziyle tekrarlayan hataları ~%30 azalttım, %99,5+ uptime sağladım.',
      ],
    },
    tech: ['PHP', 'JavaScript', 'MySQL', 'Docker', 'Nginx', 'GitHub Actions'],
  },
];

export const earlier: Localized = {
  en: 'Earlier: software development internships at BİL Holding (2020–21) and Kale Kalıp (2020) — web UIs, business-logic modules and IoT sensor data.',
  tr: 'Öncesinde: BİL Holding (2020–21) ve Kale Kalıp’ta (2020) yazılım geliştirme stajları — web arayüzleri, iş mantığı modülleri ve IoT sensör verisi.',
};
