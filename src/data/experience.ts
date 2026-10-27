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
    period: { en: 'Oct 2026 — Present', tr: 'Eki 2026 — Halen' },
    current: true,
    highlights: {
      en: [
        'Evaluate R&D proposals and progress reports of software, cloud and IoT projects for technical feasibility, architecture, innovation and R&D eligibility.',
        'Recommend approval or revision based on the review.',
      ],
      tr: [
        'Yazılım, cloud ve IoT projelerinin Ar-Ge başvurularını ve ilerleme raporlarını teknik fizibilite, mimari, yenilik ve Ar-Ge uygunluğu açısından değerlendiriyorum.',
        'İnceleme sonucunda onay veya revizyon öneriyorum.',
      ],
    },
    tech: ['Architecture review', 'Cloud', 'IoT'],
  },
  {
    company: 'Covalent',
    url: 'https://www.covalenthq.com',
    title: { en: 'Backend Developer', tr: 'Backend Developer' },
    type: { en: 'Contract · Remote', tr: 'Sözleşmeli · Remote' },
    period: { en: 'Sep 2025 — Feb 2026', tr: 'Eyl 2025 — Şub 2026' },
    highlights: {
      en: [
        'Built and maintained Node.js/TypeScript backend services and REST endpoints for the Covalent Unified API, serving on-chain data to client applications.',
        'Developed backend features for a token/NFT marketplace dApp: listing and transaction-history endpoints, wallet-based sign-in and PostgreSQL data models.',
        'Added Redis caching, pagination and rate-limit handling; documented endpoints with OpenAPI and covered them with Jest tests.',
      ],
      tr: [
        'Covalent Unified API için Node.js/TypeScript ile backend servisleri ve REST endpoint’leri geliştirip on-chain verileri istemci uygulamalara sundum.',
        'Bir token/NFT marketplace dApp’i için listeleme ve işlem geçmişi endpoint’leri, cüzdan tabanlı giriş ve PostgreSQL veri modelleri geliştirdim.',
        'Redis ile caching, sayfalama ve rate-limit yönetimi ekledim; endpoint’leri OpenAPI ile dokümante edip Jest ile test ettim.',
      ],
    },
    tech: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'OpenAPI'],
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
        'Worked on the team’s image-processing modules for UAV camera feeds (preprocessing, colour segmentation, object detection) and helped test and tune them on onboard hardware.',
      ],
      tr: [
        'Takımın İHA kamera görüntüleri için görüntü işleme modüllerinde (ön işleme, renk segmentasyonu, nesne tespiti) çalıştım; araç üstü donanımda test ve iyileştirmelerine katkıda bulundum.',
      ],
    },
    tech: ['Python', 'OpenCV'],
  },
  {
    company: 'Teknolojik Çözüm',
    title: {
      en: 'Software Developer — Backend',
      tr: 'Software Developer — Backend',
    },
    type: {
      en: 'Full-time, then part-time during studies · Istanbul',
      tr: 'Tam zamanlı, öğrenim döneminde yarı zamanlı · İstanbul',
    },
    period: { en: 'Aug 2022 — Apr 2023', tr: 'Ağu 2022 — Nis 2023' },
    highlights: {
      en: [
        'Developed backend features, REST APIs and MySQL-backed admin panels with PHP (Laravel) and JavaScript for corporate client projects.',
        'Containerised applications with Docker and Docker Compose and configured Nginx reverse proxies with TLS on Linux servers.',
        'Set up CI/CD with GitHub Actions and handled production troubleshooting through log analysis.',
      ],
      tr: [
        'Kurumsal müşteri projeleri için PHP (Laravel) ve JavaScript ile backend özellikleri, REST API’ler ve MySQL tabanlı yönetim panelleri geliştirdim.',
        'Uygulamaları Docker ve Docker Compose ile container’laştırdım; Linux sunucularda TLS’li Nginx reverse proxy yapılandırdım.',
        'GitHub Actions ile CI/CD kurdum; canlı ortamdaki sorunları log analiziyle çözdüm.',
      ],
    },
    tech: ['PHP', 'Laravel', 'MySQL', 'Docker', 'Nginx', 'GitHub Actions'],
  },
];

export const earlier: Localized = {
  en: 'Earlier: software internships at BİL Holding (2021) — PHP (Laravel) REST APIs, web UIs and MySQL reporting — and Kale Kalıp (2019) — C#/.NET modules, Python scripts for IoT sensor data and SQL reports.',
  tr: 'Öncesinde: BİL Holding’de (2021) PHP (Laravel) REST API’leri, web arayüzleri ve MySQL raporlama; Kale Kalıp’ta (2019) C#/.NET modülleri, IoT sensör verisi için Python script’leri ve SQL raporları üzerine yazılım stajları.',
};
