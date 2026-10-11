import {
  siApachemaven,
  siDocker,
  siEspressif,
  siEsphome,
  siExpress,
  siGit,
  siGithubactions,
  siGo,
  siHibernate,
  siHomeassistant,
  siJavascript,
  siJunit5,
  siKubernetes,
  siLinux,
  siMongodb,
  siMqtt,
  siMysql,
  siNginx,
  siNodedotjs,
  siOpenapiinitiative,
  siOpenjdk,
  siPhp,
  siPostgresql,
  siPostman,
  siPython,
  siSpringboot,
  siSpringsecurity,
  siSqlite,
  siTypescript,
  type SimpleIcon,
} from 'simple-icons';

import type { Locale } from '@/i18n/ui';

export interface Tech {
  name: string;
  icon?: SimpleIcon;
}

export interface StackGroup {
  title: Record<Locale, string>;
  items: Tech[];
}

export const stack: StackGroup[] = [
  {
    title: { en: 'Languages', tr: 'Diller' },
    items: [
      { name: 'Java', icon: siOpenjdk },
      { name: 'Python', icon: siPython },
      { name: 'Go', icon: siGo },
      { name: 'TypeScript', icon: siTypescript },
      { name: 'JavaScript', icon: siJavascript },
      { name: 'PHP', icon: siPhp },
      { name: 'SQL' },
      { name: 'C#' },
    ],
  },
  {
    title: { en: 'Backend', tr: 'Backend' },
    items: [
      { name: 'Spring Boot', icon: siSpringboot },
      { name: 'Spring Security', icon: siSpringsecurity },
      { name: 'Hibernate / JPA', icon: siHibernate },
      { name: 'Node.js', icon: siNodedotjs },
      { name: 'Express', icon: siExpress },
      { name: 'OpenAPI', icon: siOpenapiinitiative },
      { name: 'JWT · RBAC' },
      { name: 'Microservices' },
    ],
  },
  {
    title: { en: 'Data', tr: 'Veri' },
    items: [
      { name: 'PostgreSQL', icon: siPostgresql },
      { name: 'MongoDB', icon: siMongodb },
      { name: 'MySQL', icon: siMysql },
      { name: 'SQLite', icon: siSqlite },
      { name: 'MSSQL' },
      { name: 'Realm' },
    ],
  },
  {
    title: { en: 'Cloud & DevOps', tr: 'Cloud & DevOps' },
    items: [
      { name: 'Docker', icon: siDocker },
      { name: 'Linux', icon: siLinux },
      { name: 'Nginx', icon: siNginx },
      { name: 'GitHub Actions', icon: siGithubactions },
      { name: 'AWS (EC2, S3)' },
      { name: 'Kubernetes', icon: siKubernetes },
    ],
  },
  {
    title: { en: 'Testing & Tools', tr: 'Test & Araçlar' },
    items: [
      { name: 'JUnit', icon: siJunit5 },
      { name: 'Mockito' },
      { name: 'Postman', icon: siPostman },
      { name: 'Maven', icon: siApachemaven },
      { name: 'Git', icon: siGit },
    ],
  },
  {
    title: { en: 'IoT', tr: 'IoT' },
    items: [
      { name: 'ESP32', icon: siEspressif },
      { name: 'ESPHome', icon: siEsphome },
      { name: 'MQTT', icon: siMqtt },
      { name: 'Home Assistant', icon: siHomeassistant },
      { name: 'C/C++' },
    ],
  },
];
