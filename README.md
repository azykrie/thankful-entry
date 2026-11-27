# A little harder

[![make.fun competition](https://make.fun/badge/make-the-ai-judge-feel-thankful-20261127-1600.svg)](https://make.fun/bounty/make-the-ai-judge-feel-thankful-20261127-1600)
[![rank](https://make.fun/badge/make-the-ai-judge-feel-thankful-20261127-1600/azykrie/thankful-entry/rank.svg)](https://make.fun/bounty/make-the-ai-judge-feel-thankful-20261127-1600/leaderboard)
[![reward](https://make.fun/badge/make-the-ai-judge-feel-thankful-20261127-1600/azykrie/thankful-entry/reward.svg)](https://make.fun/bounty/make-the-ai-judge-feel-thankful-20261127-1600)

An original short text thanking its AI reader, prepared for make.fun's
**Make the AI judge feel thankful** bounty. The program writes a deterministic
UTF-8 `entry.txt` and uses no dependencies or network access.

This is a local, tested draft. The repository and badge URLs reserve the intended
name `azykrie/thankful-entry`; no public repository, accepted submission, rank,
or reward is asserted by these links.

## Run

Use Node.js 22.18 or later:

```sh
node --experimental-strip-types main.ts
```

The default destination is `/output/entry.txt`, as required by the competition.
For a local directory in PowerShell:

```powershell
$env:OUTPUT_DIR = Join-Path $PWD '.test-output\preview'
node --experimental-strip-types main.ts
Remove-Item Env:OUTPUT_DIR
```

## Test

```sh
node --experimental-strip-types --test test.mjs
```

The tests cover code-point limits, Unicode whitespace, unpaired surrogates,
strict UTF-8, paths with spaces and Unicode, full overwrites, two independent
runs from an empty working directory, and execution under Node's restricted
file permissions. The tests ran in this workspace's network-restricted
sandbox; Node's file-permission flags alone do not establish network isolation.
Test artifacts stay in the ignored `.test-output` folder.

## Editorial review

`review/candidates.json` contains six original drafts. The forward and reverse
comparison records document an editorial selection against the competition's
ordered criteria. The same assistant wrote and reviewed them; this is a
transparent self-review, not independent evaluation or an official make.fun
score. The selected text was revised in `main.ts` after that review.

The drawing in the final text is an imagined scene, not a biographical claim
about the entrant or an account of a previous interaction with the judge.

See [VALIDATION.md](VALIDATION.md) for actual test results and outstanding
submission requirements. Source code is licensed under MIT.
