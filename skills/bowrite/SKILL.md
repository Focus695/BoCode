---
name: bowrite
description: BoCode's writing skill (中文名：薄写) — write documents thin and well. Use when writing or revising any book document, README, summary, learn entry, issue, or changelog; when a draft smells like template-speak, translation-ese, or strained cleverness; whenever text must shrink without losing substance; and when drafting a document or public post from scratch — the material gate runs before writing.
---

# BoWrite（薄写）

Write it thin. Write it well.

把书读薄 is what a good reader does with a thick book. BoWrite does it at writing time: **把书写薄，把笔记写薄，把话说好——内容变少，核心没变。**

Two mandates, always together:

1. **Thin（写薄）**: fewer words, zero information lost.
2. **Well（写好）**: natural, direct, in the reader's language — never clever at the cost of clear.

## The material gate — before any from-scratch draft

Padding is written when material runs out. So the first thinning happens before writing: count what you actually hold — facts, numbers, actions, quotes, links, first-hand results. A long draft (roughly 1,200+ 字) needs enough distinct material to form a real process, not five ways to restate three ideas.

Not enough material? Three exits, in order: research what is public; ask the source (at most three questions, once); write shorter. Never pay length with re-explanations, synonym rounds, or "significance" — that is padding being born. The same test works after drafting（压缩试验）: cut a third; if nothing of substance is gone, the draft was 注水.

## The fidelity contract — before any thinning

No rewrite may add facts, drop core facts, or change who is responsible. The following never move:

- Numbers, versions, dates, commands, API names, parameter names, field names, config keys, logs, error messages
- Code blocks, table data, directory structures, links
- System-behavior subjects, domain terms, ADR conclusions, responsibility attribution
- Predicate strength: "improved performance" never softens to "touches performance"; `性能提升` never dilutes to `涉及性能`
- Ambiguous quantities stay as-is and get flagged, never "rounded" into new claims

Thinning that loses facts isn't thinning — it's damage.

## How to write it thin — the method

把书读薄 is a reading craft: strip the book until its skeleton shows, then retell it with the book closed. Writing thin runs the same craft at writing time. Six moves, in order:

### 1. 提骨架 — extract the skeleton

State each paragraph's point in one sentence. Those sentences are the document's core; everything else is a cutting candidate. A paragraph whose point you can't state in one sentence doesn't know its own point yet — fix that before thinning.

### 2. 逐句过刀 — the deletion test

For every sentence ask: 删掉它，读者会少知道什么？"没什么" → cut. A concrete something → keep, then try to say it shorter.

### 3. 合并同类 — keep the most specific

The same point said twice — prose then summary, description then table — keeps only the more specific copy. A closing paragraph that merely restates what came before goes entirely.

### 4. 修饰词折算 — modifiers pay rent

Adjectives and adverbs convert into concrete facts or get cut: `非常快` → how fast; `很多问题` → how many, which ones; `进行了优化` → what changed, by how much.

### 5. 复述检验 — the retell test

Thin it, read it once, close it, retell the core. What you can retell is the core that survived; what you can't means you cut into it — put that back. **内容变少，核心没变——核心保没保住，复述说了算。** This is 把书读薄's own test, applied at writing time.

### 6. 段段有新货 — every paragraph pays new material

Each paragraph must add something the reader didn't have: a fact, an action, an example, a distinction, a consequence. A paragraph that re-argues the previous point in new words fails the deletion test one level up — cut it or merge it. Forward motion comes from material and cause, not from "going deeper" signposts.

### Worked example

厚（62 字）：

> 在进行文档迁移的过程当中，我们总共花费了大约三天左右的时间，对所有的旧文档进行了重新的整理和归类，最终的结果是全部的 120 篇文档都顺利地完成了迁移。

薄（19 字）：

> 迁移花了三天，120 篇旧文档全部归位。

Same facts survive — 三天、全部、120 篇. What got cut is the rent-free padding: `进行`、`大约……左右`、`重新……整理`、`最终的`、`顺利地`.

## Cut on sight

- Filler openers, empty summaries, meta-commentary（`值得注意的是`、`综上所述`、"hope this helps"）
- Two sentences that say one thing become one
- Explain once — the first example or metaphor does the work, repeats go
- Intensifier clusters（`重要 / 关键 / 核心 / significant`）→ the concrete fact behind them
- Nominalized verbs（`进行 / 实现 / 完成` + 动名词）→ the action and its measure
- Long attributive chains → short subjects, direct verbs
- 二元对比骨架（`不是 X，而是 Y`）usually keeps only Y

## How to write it well — the pattern ledger

Real patterns caught in real reviews. This ledger is living: every new pattern found in review gets added here.

### 1. Cleverness that makes the reader guess

Metaphors read great to the writer and baffle the reader. If a figure of speech needs a beat of decoding, replace it with the plain statement.

- ✗ 更新文档的好处在将来，跳过它的好处在眼前，所以文档**总输**。
- ✓ ……跳过它马上就省事，所以文档**总是作用不大**。
- ✗ 每次都**付全价**。
- ✓ （删——事实句已经说清了，比喻没有增加信息）
- ✗ 不让你顺手修的**这道门，正是……的同一道门**。
- ✓ 只记录、不修复，review 的结论才可信。

### 2. Over-compression

Thin is not telegraphic. A sentence the reader can't decode on first pass carries zero information — compress words, not meaning.

- ✗ 到最后没人信文档——**不信也对**。
- ✓ 到最后没人信文档——过时的文档确实不值得信。

### 3. Emphasis formulas

`不是 X，而是 Y` / `正是……的原因` / `同一个……` are scaffolding; the claim usually stands alone without the emphasis layer.

- ✗ 这条规矩，**正是** review 能保持诚实**的原因**。
- ✓ 只记录、不修复，review 的结论才可信。

### 4. Colloquial ↔ written boundary

Spoken rhythm is welcome where it lands naturally（`越做越顺`、`踩坑`、`记一笔`、`顺手多做十二件`）；dialect and over-casual words get normalized in documents:

- `根子` → `根源` · `漂` → `漂移` · `开发点什么` → `开始开发`

### 5. Term discipline

Don't borrow terms from other fields as ordinary words:

- ✗ task notes are `工作记忆`（psychology's term for working memory）
- ✓ 任务跟踪

### 6. Translation-ese

Multilingual documents are **re-expressed** in the target language, not translated sentence-by-sentence. Signals: long subjects, passive piles, `通过……来……`, English rhythm wearing Chinese words.

- ✗ `可导航的真相`（calque of "navigable truth"）
- ✓ `能查的真相`

### 7. Multilingual mirror blind spots

Fixing a disease in one language leaves it alive in its translations — the same metaphors and compressions survive untouched because nobody looks at the siblings. When a fix lands in one language version, check the same sentences in the others.

- Found: 中文版删掉的 `付全价` / `总输`，英文原版 "at full price" / "always loses" 原样健在——修 A 语言时必须回查同句的 B/C 语言。

### 8. Intro / first-point duplication

An opening paragraph that previews the document often restates the first section in full — the same claim twice within one screen. Keep the hook in the intro; give the facts to the section that owns them.

- Found: 引言说"每开一个新会话都从零开始"，问题 1 又说"每个会话从零开始"——引言留钩子，事实归问题 1。

## Voice and rhythm — for from-scratch writing

- **Know who is speaking, and why now.** A document has an author with a position: what they did, what they checked, what they are still unsure of. State the load-bearing ones once each; don't perform an author.
- **Answer the reader's next question.** Write each section as the answer to what the previous section raised. Background arrives where it explains a choice — not up front to prove the writer knows a lot.
- **主干早出**： subject and verb before their modifiers. `在经历了长达数年的……以后，最终促使他改变方向的，是一次邀请` → 他折腾了几年没挣到钱；后来老同事找过来，他才换了方向。
- **Repeat the right word.** The keyword stays the keyword（`修表` stays `修表`）— upgrading it to `这门手艺` then `这项技能` is model-speak.
- **Let lengths breathe.** A ten-character sentence next to a forty-character one is human; all-even sentences sound like a machine keeping time. 白话打底 — plain speech carries it; ornate archaism doesn't.

## Hard bans — from-scratch public prose only

A public long-form piece（帖、公众号文章、知乎回答）drafted from scratch clears one stricter layer at delivery, and only there — project documents keep their normal rules（docs use colons and dashes legitimately）:

- No pivot scaffolding in any disguise: `不是……而是……`、`并非……而是……`、`与其说……不如说……`、`看似……实则……`、`你以为……其实……` — give the judgment from the front, then the grounds (ledger #3 is the cleanup-side version).
- No parallel runs of three or more; two is the limit, the third changes shape or goes.
- No lyric verbs on abstract nouns — time doesn't 保管 details, anxiety has no shape.
- No `——`; colons only to introduce a direct quote（`一句话总结：` is banned）.
- No business-report jargon: `赋能、抓手、闭环、底层逻辑、颗粒度、组合拳` → people, actions, money, time, consequences.

## Read-back — three passes before done

1. **Fidelity**: protected spans intact, no facts lost, terms stable, nothing reads broken after the cuts.
2. **Thinness**: what got removed — words, or information? Content shrinks, core doesn't. If the core shrank, put it back.
3. **Residue** (only if it still smells): openers, summary-closers, emphasis formulas, cleverness, over-even rhythm.
4. **From-scratch deliverables** (public prose drafted here): the material gate was passed before writing, forward motion holds（段段有新货）, and the hard bans are clear.

The finish line is "ready to send" — not "sounds human". Stop there.

## Standing on shuorenhua and human-writing

BoWrite distills two upstreams, attribution kept: [shuorenhua](https://github.com/MrGeDiao/shuorenhua)（MIT，by MrGeDiao）— the fuller plain-language ruleset, especially for Chinese cleanup — and [human-writing](https://github.com/KKKKhazix/human-writing)（MIT，by KKKKhazix）— the living-voice creation ruleset, from which the material gate, 段段有新货, voice-and-rhythm craft, and the from-scratch hard bans are distilled. Patterns from this project's own reviews ride on top. For deep Chinese cleanup or full long-form creation the upstreams go further and are worth installing alongside; `book/guidelines/writing-style.md` is the prose fallback inside every project.
