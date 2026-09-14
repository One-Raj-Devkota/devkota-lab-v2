# Devkota Lab v2

高演出版の個人ポートフォリオです。

## Stack

- SvelteKit
- TypeScript
- CSS
- Canvas particle animation
- GitHub Actions
- GitHub Pages
- Formspree-ready contact form

## Local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages

このリポジトリには `.github/workflows/deploy.yml` が含まれています。

Repository → Settings → Pages → Build and deployment → Source を **GitHub Actions** にしてください。

`main` に push / merge すると自動デプロイされます。

## Contact form

`src/lib/site.ts` の

```ts
formspreeEndpoint: 'https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID'
```

を自分のFormspree endpointへ変更するとフォーム送信が有効になります。

## Public information

公開前に `src/lib/site.ts` と `src/routes/+page.svelte` の文章・スキル・経歴が正しいか確認してください。
会社名や顧客名、機密情報は掲載しない構成にしています。
