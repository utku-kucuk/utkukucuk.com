import {
  siApachemaven,
  siDjango,
  siDocker,
  siDotnet,
  siEspressif,
  siEsphome,
  siExpress,
  siGit,
  siGithubactions,
  siHelm,
  siHibernate,
  siHomeassistant,
  siJavascript,
  siJest,
  siJira,
  siJunit5,
  siJupyter,
  siKeycloak,
  siKubernetes,
  siLaravel,
  siLinux,
  siMongodb,
  siMqtt,
  siMysql,
  siNginx,
  siNodedotjs,
  siNumpy,
  siOpenapiinitiative,
  siOpenjdk,
  siPandas,
  siPhp,
  siPostgresql,
  siPostman,
  siPython,
  siRedis,
  siSpringboot,
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
      { name: 'TypeScript', icon: siTypescript },
      { name: 'JavaScript', icon: siJavascript },
      { name: 'PHP', icon: siPhp },
      { name: 'C#' },
      { name: 'SQL' },
    ],
  },
  {
    title: { en: 'Backend', tr: 'Backend' },
    items: [
      { name: 'Spring Boot', icon: siSpringboot },
      { name: 'Hibernate / JPA', icon: siHibernate },
      { name: 'Node.js', icon: siNodedotjs },
      { name: 'Express', icon: siExpress },
      { name: 'Laravel', icon: siLaravel },
      { name: 'Django', icon: siDjango },
      { name: 'ASP.NET', icon: siDotnet },
      { name: 'OpenAPI', icon: siOpenapiinitiative },
      { name: 'JWT · RBAC' },
      { name: 'Keycloak', icon: siKeycloak },
      { name: 'Microservices' },
    ],
  },
  {
    title: { en: 'Data & Analysis', tr: 'Veri & Analiz' },
    items: [
      { name: 'PostgreSQL', icon: siPostgresql },
      { name: 'MySQL', icon: siMysql },
      { name: 'MSSQL' },
      { name: 'MongoDB', icon: siMongodb },
      { name: 'SQLite', icon: siSqlite },
      { name: 'Redis', icon: siRedis },
      { name: 'Pandas', icon: siPandas },
      { name: 'NumPy', icon: siNumpy },
      { name: 'Jupyter', icon: siJupyter },
      { name: 'Power BI' },
    ],
  },
  {
    title: { en: 'Cloud & DevOps', tr: 'Cloud & DevOps' },
    items: [
      { name: 'Docker', icon: siDocker },
      { name: 'Kubernetes', icon: siKubernetes },
      { name: 'Helm', icon: siHelm },
      { name: 'Linux', icon: siLinux },
      { name: 'Nginx', icon: siNginx },
      { name: 'GitHub Actions', icon: siGithubactions },
      { name: 'AWS (EC2, S3)' },
    ],
  },
  {
    title: { en: 'Testing & Tools', tr: 'Test & Araçlar' },
    items: [
      { name: 'JUnit', icon: siJunit5 },
      { name: 'Jest', icon: siJest },
      { name: 'Testcontainers' },
      { name: 'PHPUnit' },
      { name: 'Postman', icon: siPostman },
      { name: 'Maven', icon: siApachemaven },
      { name: 'Git', icon: siGit },
      { name: 'Jira', icon: siJira },
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
