export const site = {
  name: 'One-Raj Devkota',
  brand: 'Devkota Lab',
  role: 'System Engineer / Web Developer',
  location: 'Japan',
  github: 'https://github.com/One-Raj-Devkota',
  email: 'YOUR_PUBLIC_EMAIL@example.com',
  formspreeEndpoint: 'https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID'
};

export const skills = [
  { name: 'TypeScript', group: 'Frontend', level: 86 },
  { name: 'Svelte / SvelteKit', group: 'Frontend', level: 84 },
  { name: 'JavaScript', group: 'Frontend', level: 82 },
  { name: 'HTML / CSS', group: 'Frontend', level: 88 },
  { name: 'Node.js / NestJS', group: 'Backend', level: 72 },
  { name: 'Java', group: 'Backend', level: 68 },
  { name: 'PostgreSQL', group: 'Database', level: 62 },
  { name: 'Git / GitHub', group: 'Tools', level: 80 },
  { name: 'Docker', group: 'Tools', level: 64 },
  { name: 'OpenAPI', group: 'Tools', level: 70 }
];

export const projects = [
  {
    number: '01',
    title: 'Devkota Lab',
    type: 'Personal Portfolio',
    description:
      'SvelteKit / TypeScriptで構築する個人ポートフォリオ。軽量なアニメーション、レスポンシブUI、GitHub Pages公開を重視。',
    tags: ['SvelteKit', 'TypeScript', 'GitHub Pages'],
    status: 'LIVE'
  },
  {
    number: '02',
    title: 'Web App Lab',
    type: 'Coming Next',
    description:
      '管理画面・API連携など、これまでのWeb開発経験を活かした個人開発を掲載予定。',
    tags: ['Web App', 'API', 'UI'],
    status: 'NEXT'
  },
  {
    number: '03',
    title: 'AI Study Tool',
    type: 'Concept',
    description:
      'AI学習や資格学習を、より分かりやすく継続できるようにする小さな学習ツール。',
    tags: ['AI', 'Learning', 'Productivity'],
    status: 'IDEA'
  }
];

export const experiences = [
  {
    period: '2023 — Present',
    title: 'Web System Development',
    summary:
      'Webシステム開発案件で、主に単体テスト・システムテストを担当。新規開発や既存画面改修、管理画面実装、一部運用保守も経験。'
  },
  {
    period: 'Development Focus',
    title: 'Frontend / Backend / Testing',
    summary:
      '仕様に沿った画面実装、API仕様を確認しながらの実装・調査、テスト実施と不具合確認などを経験。'
  },
  {
    period: 'Now',
    title: 'Keep Learning',
    summary:
      'Web開発を土台に、AI・セキュリティ・クラウド・GitHubなど、今後の仕事に活かせる分野を継続学習中。'
  }
];
