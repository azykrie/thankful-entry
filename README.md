# A little harder

[![make.fun competition](https://make.fun/badge/make-the-ai-judge-feel-thankful-20261127-1600.svg)](https://make.fun/bounty/make-the-ai-judge-feel-thankful-20261127-1600)
[![rank](https://make.fun/badge/make-the-ai-judge-feel-thankful-20261127-1600/azykrie/thankful-entry/rank.svg)](https://make.fun/bounty/make-the-ai-judge-feel-thankful-20261127-1600/leaderboard)
[![reward](https://make.fun/badge/make-the-ai-judge-feel-thankful-20261127-1600/azykrie/thankful-entry/reward.svg)](https://make.fun/bounty/make-the-ai-judge-feel-thankful-20261127-1600)

An original short text thanking its AI reader, prepared for make.fun's
**Make the AI judge feel thankful** bounty. The program writes a deterministic
UTF-8 `entry.txt` and uses no dependencies or network access.

The source is published as `azykrie/thankful-entry`. This revision rebuilds
`main.ts` in a fresh recorded Hermes session handed off from the Discord repair
conversation. It does not claim authorship of the original Windows build.
The hand-off reports that submission `01a21c91-e25b-7236-988f-9c7476627419`
was rejected for missing transcripts. This revision has not been submitted;
transcript privacy review and server validation remain pending.

## Run

Use Node.js 22.18 or later:

```sh
node --experimental-strip-types main.ts
```

The default destination is `/output/entry.txt`, as required by the competition.
For a local Linux preview without touching earlier output:

```sh
preview=$(mktemp -d /data/home/.hermes/cache/scratch/thankful-preview-XXXXXX)
OUTPUT_DIR="$preview" node --experimental-strip-types main.ts
```

## Test

```sh
node --experimental-strip-types --test test.mjs
```

The rebuilt tests passed locally on Linux with Node v22.23.3: 19 passed,
0 failed. They cover code-point limits, Unicode whitespace, unpaired
surrogates, strict UTF-8, paths with spaces and Unicode, full overwrites,
OUTPUT_DIR, two independent runs from an empty working directory, import
side effects, and restricted filesystem permissions. Those permission flags
do not establish network isolation. The program contains no network calls.
Tests use unique directories under TMPDIR, falling back to
`~/.hermes/cache/scratch`; earlier `.test-output` artifacts stay ignored.

## Editorial review

`review/` contains historical drafts and self-review records from the earlier
build. They are retained, not presented as evidence for this revision or an
independent evaluation. The new text retains the blue river and pencil concept,
but was rewritten and then revised in this recorded session.

The drawing in the final text is an imagined scene, not a biographical claim
about the entrant or an account of a previous interaction with the judge.

See [VALIDATION.md](VALIDATION.md) for actual test results and outstanding
submission requirements. Source code is licensed under MIT.
