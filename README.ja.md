<p align="center">
  <img src=".github/assets/banner.svg" alt="BoCode — ドキュメントがコードを駆動し、コードがドキュメントに書き戻す" width="720">
</p>

<p align="center">
  <a href="README.md">English</a> · <a href="README.zh-CN.md">简体中文</a> · <b>日本語</b>
</p>

<p align="center">
  <a href="https://github.com/Focus695/BoCode/actions/workflows/git-policy.yml"><img src="https://github.com/Focus695/BoCode/actions/workflows/git-policy.yml/badge.svg" alt="Git Policy"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://github.com/Focus695/BoCode/generate"><img src="https://img.shields.io/badge/use_this-template-2ea44f.svg" alt="Use this template"></a>
</p>

**ドキュメントがコードを駆動し、コードがドキュメントに書き戻す、プロジェクトテンプレート。**

BoCode はリポジトリに二つの半脳を与えます——ソースを置く `code/` と、ドキュメントの流れとナレッジベースを置く `book/` です。両者は双方向に接続されます。今のソフトウェアが実際に書かれている方法、つまり人間と AI コーディングエージェントの共同開発を前提に設計されています。プロジェクトが複利的に成長するか、セッションごとにゼロリセットされるかは、知識が耐久性のある場所に置かれているかどうかで決まります。

## 一行で導入

すでにプロジェクトがある？ この一行を AI エージェントに貼り付けてください：

```text
https://github.com/Focus695/BoCode を読み（まず ADOPT.md から）、その手順どおりにこのプロジェクトを BoCode ワークフローへ移行してください。
```

ゼロから始める？ 三コマンドのクイックスタートは下にあります。

---

## なぜ BoCode が必要か

### 問題

AI エージェントで開発するプロジェクトは、ほぼ必ず三つの問題にぶつかります。

1. **エージェントは状態を持たない。** セッションは毎回ゼロから始まります。書き残されていない知識は、再導出され、再質問され、再破壊されます。
2. **ドキュメントは腐る。** 立ち上げ時に一度書かれ、二度と更新されない。更新の利益は後で、スキップの利益は今なので、更新は常に後回しにされます。やがて誰も信じなくなります——古いドキュメントは信じる価値がありません。
3. **人間がハンドルを失う。** エージェントは頼まれたものに加えて、頼まれていない十二個の変更も実装します。ゲートのないスピードは、スコープの漂移と意思決定の未記録と、「なぜ」の蒸発を意味します。

三つとも同じ根っこを指しています：知識と制御は、チャット履歴でも誰かの記憶でもない場所に住む必要がある、と。

### 二つの半脳

BoCode の答えは構造です。プロジェクトには二つの半分があります。

- **`code/`** は実行可能な真実——「いまどう動いているか」に答える
- **`book/`** はナビゲート可能な真実——「なぜこう動いているか、何を決め、何を学んだか」に答える

どちらも必須です。book のない code は書き込み専用です：動くが、なぜこの形なのかを人間もエージェントも安くは知り得ない。code のない book は日記です。二つはトップレベルに並んで置かれ、永遠に見えるので、どちらかが静かに忘れられることはありません。

### フライホイール

二つの半分が互いを駆動します：

```
                 book/  (ナレッジベース + 駆動源)
               ┌─────────────────────────────────────┐
               │  plans/      → 実装を駆動            │
               │  guidelines/ → ベースラインを提供     │
               │  learn/      → 経験を提供            │
               │  issue/      → 方向性を提供          │
               │  decisions/  → 文脈を提供            │
               └──────────────┬──────────────────────┘
                              │ 駆動
                              ▼
                          code/
                              │ 産出
                              ▼
               ┌─────────────────────────────────────┐
               │  summary/    ← 機能の報告書          │
               │  learn/      ← 新しい経験            │
               │  issue/      ← 発見された問題        │
               │  changelogs/ ← 変更記録              │
               │  plans/      ← 完了ステータス        │
               └─────────────────────────────────────┘
```

**book → code**：実装の前に、エージェントは plan（施工図）、guidelines（ベースライン）、関連する learn エントリ（蓄積された経験）、未解決の issue（既知の地雷）を読みます。

**code → book**：作業が終わったらクローズアップで書き戻します——人間が diff を開かずに読める summary、次のセッションが検索できる learn、記録はするがあえて直さない issue、changelog の一行、そして再生成されたインデックス。

これがフライホイールです：一周ごとに book は前より完全になり、すべてのセッション——人間もエージェントも、今日も一年後も——これまでの学びの上から始まります。**book が完全なほど、次にプロジェクトに触れるすべての人への価値が高まる。** 開発はリセットではなく複利になります。

---

## 手法

### ブレーキではなくゲート

すべての機能は六段階のワークフローを硬いゲート付きで通ります（`book/guidelines/workflow.md`、振る舞いは `feature-flow` スキルが強制）：

| フェーズ | 産出 | ゲート |
|-------|--------|------|
| Step 0 — 要件ブリーフ | 背景、スコープ、除外項目、要件 | 全スロット記入——**除外リストは必須**。空の除外リストがスコープ外変更の最大の原因 |
| 1 — 分析 | 影響マップ + リスク一覧 | コードは一行も変更しない |
| 2 — 設計 | データフロー、ファイル、インターフェース | **ユーザーの承認が必要** |
| 3 — 実装 | コード | 承認されたスコープの外には手を出さない |
| 4 — テスト | テスト（先に書く） | 全グリーン、アサーションを弱めない |
| 5 — レビュー | 発見事項リスト | 記録のみ、その場で直さない |
| 6 — クローズアップ | summary、learn、issue、changelog、インデックス | 記録のみ、その場で直さない |

設計意図：エージェントは実装を分単位に圧縮するので、ボトルネックは意思決定とスコープに移ります。ゲートは人間の手をまさにそこに置きます——Step 0 が要求に書かれていないことを埋め、Phase 2 で人が方向を承認し、Phase 5〜6 が観察と修正の分離を強制します。**レビューで見つかった問題は記録された issue になり、直すのは別の仕事です。** その場で直させないゲートこそが、レビューを正直に保つゲートです。

### 読者のために書く

book のドキュメントは産出物の種類ではなく読者で振り分けます（`book/notes/`）：

| 種類 | 読者 | 形 |
|------|-------------|-------|
| `summary/` | 人間 first | 報告書：背景 → 何をしたか → なぜ → 結果 |
| `learn/` | 人間 + エージェント | タグ付きの検索可能なナレッジエントリ——"timeout" のような症状タグも含む |
| `issue/` | 人間 + エージェント | 問題 + 再現 + 修正方向の提案 |
| `task/` | 作業メモリ | チェックリスト |

diff を読まないと分からない summary は summary ではありません。タイトルだけで質問に答えられない learn は、次のセッションに検索されません。`book/notes/README.md` のテンプレートが品質基準を示しています。

### インデックス契約

見つけられないドキュメントは、存在しないのと同じです。BoCode は発見可能性をビルドチェックにします：

- すべての book ドキュメントは frontmatter の `description` で始まる——体裁ではなく内容を語る、人の言葉で一行
- `code/tools/gen-book-index.mjs`（依存ゼロ、プレーン Node）が `book/README.md`——全ドキュメントのマスターインデックス——を再生成する
- description の欠けたドキュメントはビルドを**失敗させる**（exit 1）。ゼロ警告だけが合格です

`book/README.md` は入口も兼ねます：エージェントはまずここで地図を手に入れる。フォルダはそのまま [Obsidian](https://obsidian.md) の vault として開けます。

### 人の言葉で書く

ドキュメントは何年も読まれ、数分で書かれる。だからスタイル規則は短く厳格です（`book/guidelines/writing-style.md`）：具体的な人が具体的な状況で話すように書く——プロフェッショナルで構わないが、テンプレート的なのは不可。埋め草の前置きと空っぽのまとめを削り、事実は固定する——数値・コマンド・名前・責任の所在は動かさない。この基準は `bowrite` スキル（薄写：薄く書く——文は減り、核は変わらない；うまく書く——自然に、直接に）がエージェント側で担い、MrGeDiao の [shuorenhua](https://github.com/MrGeDiao/shuorenhua) と本プロジェクトのレビューで蓄積したパターンから蒸留されています。

### クリーンな git フロー

git 履歴は book の一部です（`book/guidelines/git-workflow.md`）。マージ以外のすべてのコミットは [Clean Commit](https://github.com/wgtechlabs/clean-commit) 形式——`📦 new (index): add book index generator`——に従い、ブランチは [Clean Flow](https://github.com/wgtechlabs/clean-flow) モデル（`work → dev → main`）に従います。両スペックはドキュメントしか同梱しておらず、BoCode はそのギャップを、依存ゼロのバリデータ（ローカル `.githooks/` と CI `.github/workflows/git-policy.yml`）で埋めます。運用では：`dev` はソロ開発者の統合ブランチで、検証済みの小さな修正は直接 land する。大きな機能はワークブランチを切り、`main` は `dev` からのマージコミットだけを受け取ります。

### 自らを使って構築し、きれいに届ける

BoCode は自分自身の最初のユーザーです：基盤は構造化された要件ブリーフ、承認された設計プラン、段階的な実装とステップごとの検証、Clean Commit の履歴を通りました——物語全体は git ログで読めます。あなたが受け取るテンプレートはきれいです：日付付きの記録も残された plan もなく、book は空で、あなたのものを待っています。意図的に一つだけ同梱されているのは [ADR-001](book/docs/decisions/ADR-001-adopt-bocode.md)——このワークフローで動くという意思決定であり、あなたのプロジェクトが最初に再確認する決定でもあります。

---

## クイックスタート

```bash
# 1. このテンプレートからリポジトリを作成（GitHub の "Use this template"）
#    またはクローン：
git clone <your-fork-url> myproject && cd myproject

# 2. テンプレートをあなたのプロジェクトに変える（名前、説明、記録のクリーンアップ）：
bash scripts/init-project.sh myproject "What it does, in one line"

# 3. AI エージェントに四つのスキルをインストール：
cp -r skills/bocode skills/feature-flow skills/book-writeback skills/bowrite <your-skills-dir>/
#    (ZCode: ~/.zcode/skills/ · Claude Code: ~/.claude/skills/ — 詳細は skills/README.md)

# 4. エージェントを AGENTS.md に向ける——ほとんどのツールが自動で読みます。
#    あとは何かを作るだけ。スキルがワークフローを駆動します。
```

必要なもの：`bash` と `node`（二つのスクリプト用）。パッケージなし、インストールステップなし、lockfile なし——ツールチェーンは意図的に退屈に作られています。

## リポジトリツアー

| パス | 内容 |
|------|------------|
| `AGENTS.md` | AI エージェントの入口——構造、ルール、ハード制約 |
| `book/guidelines/` | ルールブック：ワークフロー、文書スタイル、git、レビュー |
| `book/README.md` | マスターインデックス（生成物——ここから始める） |
| `book/plans/` | 実装プラン（施工図） |
| `book/notes/{summary,learn,task,issue}/` | 四種類のノート |
| `book/docs/{architecture,api,decisions}/` | スナップショット、契約、ADR |
| `skills/` | `bocode`、`feature-flow`、`book-writeback`、`bowrite` |
| `code/tools/gen-book-index.mjs` | インデックスジェネレータ |
| `scripts/init-project.sh` | テンプレート → あなたのプロジェクト |
| `scripts/check-commit-message.mjs` | Clean Commit バリデータ（`.githooks/` 付き） |

## FAQ

**すでに存在するプロジェクトに BoCode を導入できますか？**
はい——[ADOPT.md](ADOPT.md) を AI エージェントに渡してください。エージェント向けに書かれた段階的な移行プレイブックです：棚卸し、book スケルトン、レイアウト決定、ドキュメント移行、ツールチェーン、スキル、最初の書き戻し。手動の道もあります：`book/`、`skills/`、`scripts/`、`.githooks/`、`AGENTS.md`、`code/tools/` をコピーし、既存ドキュメントを book に統合し、インデックスジェネレータを実行するだけです。

**言語やスタックに縛られますか？**
いいえ。book は Markdown、二つのスクリプトは依存ゼロのプレーン Node です。`code/` には何を置いても構いません——テンプレート自身の `code/` にはツールしか入っていません。

**どの AI ツールで動きますか？**
`AGENTS.md` を指示ファイルとして読み、`SKILL.md` 形式をサポートするものなら何でも（ZCode、Claude Code、互換エージェント）。スキルがなくてもワークフローは劣化なしで機能します：guidelines が同じルールを文章で運びます。

**インデックスを再生成しないとどうなりますか？**
実行時には何も壊れません——しかしインデックスが古くなれば、システム全体が依存する発見可能性が崩れていきます。だからこそチェックは、description の欠落を派手に失敗させます。

**機能ごとのフォルダではなく `YYYY-MM/` なのはなぜ？**
月は安定した低メンテナンスの物理グルーピングです。機能はインデックス、frontmatter、リンクで見つかる——数ヶ月にわたる機能を毎回切り刻むディレクトリのネストではなく。

## クレジット

BoCode の git 規律は WGTech Labs の二つのオープンスタンダード——[Clean Commit](https://github.com/wgtechlabs/clean-commit)（コミットメッセージ形式）と [Clean Flow](https://github.com/wgtechlabs/clean-flow)（ブランチモデル）——の上に構築され、両スペックが記述するが同梱しない実行ツールを追加しています。人の言葉で書くスタイルは MrGeDiao の [shuorenhua](https://github.com/MrGeDiao/shuorenhua) に由来し、`bowrite` スキルへ蒸留されています。

## ライセンス

[MIT](LICENSE)
