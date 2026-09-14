# Devkota Lab v2

SvelteKit + TypeScript の高演出版ポートフォリオです。

公開先:
https://one-raj-devkota.github.io/devkota-lab-v2/

## GitHub Pages
Repository → Settings → Pages → Source を **GitHub Actions** に設定してください。

## Contact
`src/lib/site.ts` の `formspreeEndpoint` を自分のFormspree URLへ変更すると、問い合わせフォーム送信が有効になります。


## Access gate

- 閲覧コード: `20260914`
- ブラウザ側でSHA-256照合を行い、認証後は同じタブ内で再入力不要です。
- 注意: GitHub Pagesは静的サイトのため、これは「簡易アクセス制限」です。本格的な秘匿が必要な場合はサーバー側認証が必要です。

## Contact form

送信先は `ydevko98@gmail.com` に設定済みです。
FormSubmitを使用するため、最初のテスト送信時に確認メールが届きます。
その確認メール内の有効化リンクを押した後、以降の問い合わせがメールに届くようになります。
