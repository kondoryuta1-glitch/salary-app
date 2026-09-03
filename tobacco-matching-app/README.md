# タバコ休憩マッチングアプリ

Slack上で「今タバコ吸いたい」というタイミングが合った同僚同士をマッチングするアプリです。
給料アプリ（salary-app）とは完全に独立したプロジェクトです。

## できること

- `/tabako-join` : タバコ休憩グループに参加（このコマンドを実行したメンバーにだけお誘いが届きます）
- `/tabako-leave` : グループから抜ける
- `/tabako-members` : 現在のグループメンバー一覧を表示
- `/tabako` : グループの他のメンバー全員にDMで「タバコ休憩に行きたい」アラートを送信
  - 相手は次の3パターンで反応できます
    - **🚬 行く** : その場でマッチング成立。お互いにDMで通知されます
    - **🕓 あとで**（会議中など） : 依頼者に「今は忙しいので後で行けたら連絡する」旨が通知される
    - あとでボタンを押した相手には、DMに **🚬 今なら行けます！** ボタンが表示され、手が空いたタイミングでいつでも押すとマッチング成立として依頼者に通知されます
  - 依頼者のDMには常に最新のステータス（参加済み / あとで / 返信待ち）がまとまったメッセージが自動更新されます
  - お誘いには有効期限があり（デフォルト20分、`REQUEST_TTL_MINUTES` で変更可）、期限切れ後のボタン操作は「このお誘いは終了しました」と表示されます

## セットアップ

### 1. Slack アプリを作成

1. https://api.slack.com/apps で「Create New App」→「From scratch」
2. **Socket Mode** を有効化し、`connections:write` スコープを持つ App-Level Token を発行（`SLACK_APP_TOKEN` に設定）
3. **OAuth & Permissions** で Bot Token Scopes に以下を追加し、ワークスペースにインストール
   - `chat:write`
   - `commands`
   - `im:write`（ユーザーへのDM送信に使用）
4. **Slash Commands** で以下の4つを登録（Request URL は Socket Mode を使う場合は不要）
   - `/tabako` - タバコ休憩に誘う
   - `/tabako-join` - グループに参加する
   - `/tabako-leave` - グループから抜ける
   - `/tabako-members` - メンバー一覧を見る
5. **Interactivity & Shortcuts** を ON にする（Socket Mode ならRequest URLは不要）
6. Bot Token（`xoxb-...`）と Signing Secret（Basic Information ページ）を控える

### 2. 環境変数を設定

```bash
cp .env.example .env
# .env を編集して SLACK_BOT_TOKEN / SLACK_APP_TOKEN / SLACK_SIGNING_SECRET を設定
```

### 3. インストールして起動

```bash
npm install
npm start
```

## データの保存について

メンバー登録状況とお誘いの状態は `data/db.json` にシンプルなJSONファイルとして保存されます（外部DB不要）。
このファイルは `.gitignore` 済みです。

## 今後の拡張アイデア

- 特定の同僚を指名して1対1でお誘いを送る
- 通知しない時間帯（勤務外など）の設定
- 喫煙所ごとのグループ分け
- マッチング履歴の集計（誰とよく一緒に行くか等）
