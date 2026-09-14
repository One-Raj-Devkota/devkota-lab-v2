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


## Mail v2

FormSubmitの activation email に記載されたランダムIDをフォーム action に使用するよう変更しました。
メール件名は `【Devkota Lab】Webサイトからお問い合わせ`、本文は table 形式で
「お名前 / email / 件名 / お問い合わせ内容」が見やすく表示されます。


## Redirect after submit

問い合わせ送信後は FormSubmit の完了ページではなく、
`https://one-raj-devkota.github.io/devkota-lab-v2/#contact`
へ自動的に戻るよう `_next` を設定済みです。


## Multilingual
日本語 / English / नेपाली の3言語切替対応。ヘッダーの JP / EN / ने で切替でき、選択言語はブラウザに保存されます。
