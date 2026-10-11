export const languages = {
  en: 'English',
  tr: 'Türkçe',
} as const;

export type Locale = keyof typeof languages;

export const defaultLocale: Locale = 'en';

export const ui = {
  en: {
    'meta.title': 'Utku Küçük — Backend Software Engineer',
    'meta.description':
      'Backend Software Engineer building reliable APIs and infrastructure with Java, Spring Boot, Docker and Linux. Based in Istanbul.',
    'nav.about': 'About',
    'nav.experience': 'Experience',
    'nav.work': 'Work',
    'nav.stack': 'Stack',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.close': 'Close',
    'nav.skip': 'Skip to content',
    'theme.toggle': 'Toggle color theme',
    'lang.switch': 'Türkçe',
    'lang.switchLabel': 'Bu sayfayı Türkçe görüntüle',
    'hero.greeting': 'Hi, I’m',
    'hero.role': 'Backend Software Engineer',
    'hero.tagline':
      'I design, ship and operate the services behind products — APIs, data pipelines and the infrastructure that keeps them running.',
    'hero.cta.work': 'Selected work',
    'hero.cta.contact': 'Get in touch',
    'hero.scroll': 'Scroll',
    'hero.available': 'Open to new opportunities',
    'footer.built': 'Designed & built with Astro, Three.js and GSAP.',
    'footer.source': 'View source',
    'footer.top': 'Back to top',
  },
  tr: {
    'meta.title': 'Utku Küçük — Backend Yazılım Mühendisi',
    'meta.description':
      'Java, Spring Boot, Docker ve Linux ile güvenilir API’ler ve altyapılar geliştiren Backend Yazılım Mühendisi. İstanbul.',
    'nav.about': 'Hakkımda',
    'nav.experience': 'Deneyim',
    'nav.work': 'Projeler',
    'nav.stack': 'Teknolojiler',
    'nav.contact': 'İletişim',
    'nav.menu': 'Menü',
    'nav.close': 'Kapat',
    'nav.skip': 'İçeriğe geç',
    'theme.toggle': 'Renk temasını değiştir',
    'lang.switch': 'English',
    'lang.switchLabel': 'View this page in English',
    'hero.greeting': 'Merhaba, ben',
    'hero.role': 'Backend Yazılım Mühendisi',
    'hero.tagline':
      'Ürünlerin arkasındaki servisleri tasarlıyor, geliştiriyor ve işletiyorum: API’ler, veri akışları ve hepsini ayakta tutan altyapı.',
    'hero.cta.work': 'Projelerim',
    'hero.cta.contact': 'İletişime geç',
    'hero.scroll': 'Kaydır',
    'hero.available': 'Yeni fırsatlara açığım',
    'footer.built': 'Astro, Three.js ve GSAP ile tasarlandı ve geliştirildi.',
    'footer.source': 'Kaynak kodu',
    'footer.top': 'Başa dön',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];
