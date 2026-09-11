# 9 Kings 日本語攻略

Markdownで記事を書き、GitHubのmainブランチへpushするとGitHub Pagesに自動公開する静的サイトです。本文は現在、検証前のサンプルです。

## 1. 使用技術・環境

- WSL2 / Ubuntu、VS CodeのWSL接続
- nvm 0.40.7 / Node.js 24.21.0 LTS / npm 11.19.0
- Astro 7.3.2（構築時の最新版）、TypeScript 6系、Astro Content Collections
- Astro公式Sitemapインテグレーション、GitHub Actions / GitHub Pages
- 通常のHTML・CSSで表示し、ブラウザで動く独自JavaScriptは使用しません。

Astroの要求はNode.js 22.12.0以上・npm 9.6.5以上です。型チェックツールの対応範囲に合わせてTypeScriptは6系を使用します。実際の依存バージョンは`package-lock.json`に固定しています。

Node.jsはUbuntuの`~/.nvm/`、Astro等はこのプロジェクトの`node_modules/`にあります。Windows側へのインストール、Pythonのvenv、DB、レンタルサーバー、グローバルnpmパッケージは不要です。元の`/usr/bin/node`や既存の`.bashrc`は変更していません。

## 2. まずローカルで開く

VS Code左下がWSL Ubuntuへの接続であることを確認し、「ターミナル → 新しいターミナル」を開きます。以下はすべて**Ubuntuのターミナル**で実行します。

```bash
cd /home/ryu/projects/9kings-guide
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm use
node --version
npm --version
npm install
npm run dev
```

ブラウザで **http://localhost:4321/** を開きます。Windows側のブラウザを利用して構いません。ファイルを保存すると表示に反映されます。停止はターミナルで`Ctrl+C`です。ポートが使用中なら、ターミナルに表示されたURLを開いてください。

バックグラウンドで起動した旨が表示された場合は、`npm run dev -- status`で状態を確認し、`npm run dev -- stop`で停止できます。

既存のシェル設定を保持するため、nvmの自動読み込み設定は追加していません。**新しいターミナルを開くたびに上記の`export`・`.`・`nvm use`を実行**してください。`nvm: command not found`の場合も同じ手順です。`command -v node`が`/home/ryu/.nvm/versions/node/...`を示せば正しい環境です。

別のWSL環境で再構築する場合は、[nvm公式手順](https://github.com/nvm-sh/nvm#installing-and-updating)でnvmを入れ、プロジェクト内で`nvm install`を実行すると`.nvmrc`のNode.jsが導入されます。

VS Code拡張機能の「Astro」は必要に応じてWSL側にインストールしてください。

## 3. フォルダ構成

```text
.github/workflows/deploy.yml   GitHub Pages自動公開
.nvmrc                        使用するNode.jsの固定
astro.config.mjs              site・base path・sitemap設定
package.json                  依存関係・実行コマンド
package-lock.json             依存関係の固定（Gitに含める）
src/
  lib/site.ts                 サイト名・説明・カテゴリ・URL処理
  content.config.ts           記事の必須項目と型の検証
  content/articles/
    guides/                   一般攻略
    kings/                    王そのものの攻略
    quests/                   クエスト攻略
    cards/                    カード情報
  assets/images/              記事内の画像
  components/ArticleList.astro 記事一覧
  layouts/BaseLayout.astro    ヘッダー・ナビ・SEO設定
  pages/index.astro           トップページ
  pages/[category]/           カテゴリ一覧・記事の自動生成
  pages/404.astro             見つからないページ
  styles/global.css          全体の見た目
public/favicon.svg            favicon（差し替え可能）
scripts/check-links.mjs        ビルド後の内部リンク検査
dist/                         生成HTML（Git管理対象外）
```

`/guides/`には全記事、`/kings/`には王で分類した全記事、`/quests/`にはクエスト記事、`/cards/`にはカード記事を表示します。王専用の記事がなくても、その王のクエストやカードを王一覧から探せます。

## 4. 新しい記事を追加する

例として`src/content/articles/kings/nature-basics.md`を作成します。`kings`フォルダに以下を保存すると、`/kings/nature-basics/`が自動生成されます。ページファイルや一覧を手作業で追加する必要はありません。

```markdown
---
title: '自然の王の基本攻略'
description: '自然の王の基本的な進め方をまとめます。'
category: kings
king: '自然の王'
date: 2026-09-11
tags:
  - 自然の王
  - 検証待ち
version: ''
---

## 概要

ここに攻略情報を記載。

## 攻略の進め方

検証後に追記。
```

- ファイル名・サブフォルダ名は半角英小文字・数字・ハイフンにします。
- `category`は親カテゴリフォルダ名と一致させます。
- 王やバージョンで下位フォルダを作ることも可能です。例：`quests/nature/arboretum.md` → `/quests/nature/arboretum/`。
- ファイル移動・名前変更は公開URLも変更します。公開済み記事はむやみに移動しないでください。
- 保存した`.md`はすべて公開対象です。下書きや個人情報を入れないでください。
- 今のサンプル記事は確認用です。公開前に内容を確認し、検証済みの内容へ書き換えてください。

### frontmatterの意味

ファイル先頭の`---`で囲んだ部分がfrontmatterです。YAML形式で記述します。

| 項目 | 必須 | 意味・例 |
| --- | --- | --- |
| `title` | 必須 | 記事タイトル |
| `description` | 必須 | 記事一覧や検索エンジン向けの説明 |
| `category` | 必須 | `guides` / `kings` / `quests` / `cards` |
| `king` | 必須 | 王の名前。共通記事は`共通`。一覧でまとまるよう表記を統一 |
| `date` | 必須 | 投稿日。`2026-09-11`の形式 |
| `tags` | 必須 | タグの配列。タグなしは`[]` |
| `japaneseName` | カード必須 | カードの日本語名 |
| `englishName` | カード必須 | カードの英語名 |
| `cardType` | 任意 | カード種類。未確認なら省略（画面では未確認と表示） |
| `version` | 任意 | ゲームバージョン。未確認なら空文字または省略 |
| `cover` | 任意 | 将来の画像一覧にも使える画像への相対パス |
| `coverAlt` | cover使用時必須 | 画像の内容を説明する代替テキスト |

カードの例（依頼時の仮データであり、ゲーム内の表記は要検証）：

```yaml
---
title: 'Earthworks（土木工事）'
description: '石の王のカード Earthworks の解説'
category: cards
king: '石の王'
japaneseName: '土木工事'
englishName: 'Earthworks'
cardType: 'Building'
version: ''
date: 2026-09-11
tags:
  - 石の王
  - 建物
---
```

本サイトの`king`は日本語に統一しています。`King of Stone`のような英語文字列も保存できますが、`石の王`とは別グループになるため混在させないでください。

### Markdownの書き方

```markdown
## 大きな見出し

### 小さな見出し

通常の文章です。空行で段落を分けます。

**太字**で重要な箇所を示します。

- 箇条書き1
- 箇条書き2

1. 手順1
2. 手順2

> 注意事項や引用

[外部サイト](https://example.com)

| 項目 | 内容 |
| --- | --- |
| 効果 | 検証後に追記 |
```

記事タイトルは自動で表示するため、本文は`##`から始めます。

**サイト内リンクは公開URL同士の相対パス**で書くとbase pathに対応します。`/quests/arboretum/`の記事から`/cards/earthworks/`へリンクする例：

```markdown
[Earthworksの解説](../../cards/earthworks/)
```

Markdownファイルへのリンクではなく、公開後のURLを指定します。記事の階層が増える場合は`../`の数を調整します。`/cards/earthworks/`のようなルート始まりのURLは、GitHub Pagesのリポジトリ名を飛ばすため避けてください。`npm run build`で内部リンクを検査できます。

## 5. 画像の追加

スクリーンショットを`src/assets/images/`に保存します。例：`earthworks.png`。

`src/content/articles/cards/earthworks.md`からは以下のように記述します。

```markdown
![Earthworksのカード画面](../../../assets/images/earthworks.png)
```

画像はAstroが処理し、base pathに対応したURLで出力します。記事を深いサブフォルダに置いたときは画像までの相対パスも調整してください。動作する例は`guides/getting-started.md`と`src/assets/images/placeholder.svg`です。

記事の先頭画像にする場合はfrontmatterに以下を追加します。

```yaml
cover: '../../../assets/images/earthworks.png'
coverAlt: 'Earthworksのカード画面'
```

ゲーム画像は同梱していません。自分で撮影した画像を、ゲーム側の利用条件に従って追加してください。

`public/`はfaviconやOGP画像など加工不要の共通ファイル用です。記事内の画像は上記の`src/assets/images/`方式を推奨します。

## 6. 確認・ビルド

nvm読み込みと`nvm use`を済ませたターミナルで実行します。

```bash
npm install
npm run check
npm run build
npm run preview
```

- `npm install`：必要な依存関係をプロジェクト内に導入。
- `npm run check`：TypeScriptとAstroの型・構文を確認。
- `npm run build`：型チェック → 静的HTML生成 → 内部リンク・画像等の存在検査。どこかで失敗すると停止します。
- `npm run preview`：生成した`dist/`をローカルで確認。表示されたURL（通常`http://localhost:4321/`）を開きます。

外部サイトのリンク先の稼働状態は自動検査の対象外です。本文の事実確認は別途必要です。

GitHub Pagesと同じbase pathで試すには、`YOUR_NAME`をGitHubユーザー名に置き換えて実行します。

```bash
SITE_URL=https://YOUR_NAME.github.io BASE_PATH=/9kings-guide npm run build
SITE_URL=https://YOUR_NAME.github.io BASE_PATH=/9kings-guide npm run preview
```

この場合は`http://localhost:4321/9kings-guide/`を開きます。環境変数はそのコマンドにだけ適用されます。通常のローカル版へ戻すには`npm run build`で再生成します。

## 7. Gitの基本操作

このフォルダは`main`ブランチで初期化済みです。初回commitやリモート接続はまだ行っていません。

初回のみ、自分の名前とメールを設定します（このプロジェクトだけの設定です）。メールにはGitHubの非公開用noreplyアドレスも使えます。

```bash
git config user.name "あなたの名前"
git config user.email "GitHubに登録したメールまたはnoreplyアドレス"
```

普段は次の順で操作します。

```bash
git status
npm run build
git diff
git add .
git diff --cached
git commit -m "攻略サイトの初期構成を追加"
```

`git status`は変更一覧、`git diff`は変更内容、`git add`は次の保存対象の選択、`git commit`はローカルへの履歴保存です。新規ファイルの内容は`git diff --cached`で確認できます。1記事だけ選ぶなら`git add src/content/articles/quests/arboretum.md`のように指定します。

`.gitignore`で`node_modules/`、`dist/`、`.astro/`、キャッシュ、環境変数ファイル、OS・エディタ由来の不要ファイルを除外しています。`package-lock.json`は必ずGitに含めます。

## 8. GitHubリポジトリ作成・接続

1. ブラウザでGitHubにログインし「New repository」を選びます。
2. 名前を`9kings-guide`などにし、無料枠で公開するならPublicを選びます。
3. README・.gitignore・Licenseの自動追加は選ばず、**空のリポジトリ**を作ります。
4. 前節の初回commitを済ませます。
5. 以下の`YOUR_NAME`を自分のユーザー名に置き換え、Ubuntuで実行します。

```bash
git remote add origin https://github.com/YOUR_NAME/9kings-guide.git
git remote -v
```

既にoriginがある場合は、追加を繰り返さず`git remote -v`で接続先を確認してください。

HTTPSで認証を求められたらVS CodeのGitHubログインを使うか、GitHubで作成したPersonal Access Tokenをパスワード入力欄に使います。GitHubアカウントの通常パスワードは使えません。トークンをURL・README・コードへ書かないでください。認証の詳細は[GitHub公式手順](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github#authenticating-with-the-command-line)を参照してください。

## 9. GitHub Pages設定と初回公開

1. GitHubリポジトリの **Settings → Pages** を開きます。
2. **Build and deployment → Source → GitHub Actions** を選びます。
3. Ubuntuのターミナルでpushします。

```bash
git push -u origin main
```

4. GitHubの **Actions** タブで「Deploy to GitHub Pages」が成功したことを確認します。
5. **Settings → Pages** またはActionsのdeploy結果に表示されたURLを開きます。通常は`https://YOUR_NAME.github.io/9kings-guide/`です。

Pages設定前にpushした場合は、設定後にActionsから「Run workflow」または失敗した実行の再実行を選びます。GitHub側でActionsが無効な場合はリポジトリ設定で有効にしてください。

### 自動公開の仕組み

`main`へのpush → UbuntuのActions runner → Pages公開URL取得 → Node.jsとnpm依存導入 → `npm run build` → 成果物アップロード → Pagesへデプロイ、の順で動きます。Astro公式`withastro/action`を使用します。型やリンクの検査に失敗すると新しい成果物は公開されません。

`actions/configure-pages`から公開originとbase pathを取得し、`SITE_URL`・`BASE_PATH`として`astro.config.mjs`に渡します。通常のリポジトリサイト（`/9kings-guide/`）、ユーザーサイト（`/`）に対応します。リポジトリ名が変わっても設定に手書きする必要はありません。カスタムドメインを将来設定する場合も、GitHub Pages側のURL設定に追従します。

公開時はcanonical・OGP URLと`sitemap-index.xml`が生成されます。公開URL未設定のローカルビルドでは、仮の公開URLやsitemapは生成しません。

以後の記事更新は以下で公開できます。

```bash
npm run build
git add .
git commit -m "樹木園の攻略情報を更新"
git push
```

`git push`はローカルのcommitをGitHubへ送ります。複数PCで作業する場合は、編集前に`git pull --ff-only`で最新状態を取り込んでください。

## 10. サイト名・SEO・見た目を変更する

- **サイト名・サイト説明**：`src/lib/site.ts`の`siteConfig.name`と`description`を変更。
- **記事ごとのtitle・description**：各Markdownのfrontmatterを変更。
- **favicon**：`public/favicon.svg`を自分のSVGで差し替え。PNG等にする場合は`BaseLayout.astro`のファイル名とtypeも変更。
- **OGP画像**：`public/og-image.png`を追加し、`src/lib/site.ts`の`ogImage`を`'/og-image.png'`に変更。画像未設定でもタイトル・説明・種類・日本語ロケールは出力します。
- **sitemap**：導入済み。公開URLを設定したビルドで自動生成。
- **色・余白・スマートフォン表示**：`src/styles/global.css`を変更。

## 11. 将来の拡張

`japaneseName`、`englishName`、`king`、`cardType`、`tags`、`version`を別々の項目として保持しています。将来は`getCollection('articles')`で取得したデータから検索用JSONを生成し、検索・絞り込みを追加できます。現時点では検索用JavaScriptはありません。

王・カード種類・タグの表記を統一しておくと検索が容易になります。バージョン違いの別記事は`cards/v1/earthworks.md`など別URLにし、`version`を設定できます。アップデート履歴はまず`guides/updates/`に追加可能です。画像付き一覧は任意の`cover`・`coverAlt`を利用して`ArticleList.astro`を拡張できます。

## 参考にした公式資料

- [Astroインストール要件](https://docs.astro.build/en/install-and-setup/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [AstroのGitHub Pages公開手順](https://docs.astro.build/en/guides/deploy/github/)
- [nvm](https://github.com/nvm-sh/nvm)
