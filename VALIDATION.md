# Validation and remaining work

Checked on **27 November 2026**. This is a local draft, not an accepted entry.

## Authentication update

The official CLI completed the replacement device approval and printed
`Connected: entries now go in as @azykrie` on 27 November 2026. The resulting
key is stored privately and expires on 27 December 2026. The connected wallet
is recorded in `.makefun/owner.json` as repository ownership proof.

Network access is now available. The older network-denied and cached-key
observations below are historical. GitHub sign-in has also completed, and
`gh api user` verifies `azykrie` (user id 96452965) using the Windows user's
credential store. The sandboxed execution context still returned 401, so a
sandbox-only failure must not be mistaken for failure of that verified login.
No public repository or accepted submission has been established.

The transcript package remains incomplete: this kit rejects the original
session's builtin MCP declaration, and the log also contains private internal
instructions that cannot be uploaded. No archive containing them was created.

## Program tests

Command: `node --experimental-strip-types --test test.mjs`.

Result: **17 passed, 0 failed**, on Windows with Node.js **24.12.0**.
The initial draft and revised final text were both tested. Coverage includes:

- Non-whitespace content and both ends of the 1-1,000-code-point range.
- ASCII, astral Unicode, combining marks, and invalid lone surrogates.
- Strict UTF-8 encoding, exact output bytes, and no added BOM.
- Nested output paths containing spaces and Unicode.
- Full overwrite of an older longer artifact.
- Two independent process executions from an otherwise empty directory,
  returning the same bytes and SHA-256, within a five-second test timeout.
- A real production execution with restricted Node file permissions.
- A nonzero exit when the destination cannot be a directory.
- Valid format for all six original writing candidates.

The final artifact has **387 Unicode code points and 387 UTF-8 bytes**.
Its SHA-256 is:

```text
46ac6dbff3e120cd80a149789cd7547461616dacef5ddb7a205d3048bcbb9f25
```

The default `/output/entry.txt` path is present in the source. Test runs used
`OUTPUT_DIR` inside this workspace; the Linux default path was not executed.
The program imports only standard filesystem, path, and URL modules and makes
no network calls. The host sandbox restricts network access. Node's file
permission flags are not claimed to provide network isolation.

## Official kit checks

The CLI's SHA-256 matched the manifest already downloaded for this bounty:

```text
1d1663a5d3e1955a5647d6f8fd594af1d928df59a017c5963495112b7abc30b5
```

`../research/check-thankful-local.mjs` ran the unmodified official checker on
the working tree and the original Codex build log. Result: **13 pass, 5 skip,
1 fail, 5 checked at submission**. This is not an all-clear.

The passed checks include license, entrypoint, snapshot limits, transcript
presence and recorded origin, timestamps, build window, authorship coverage,
assistant turns, priced usage, actual file revision, and own work.

The failed check is `transcripts_run_record`: a loose original log alone does
not provide the required run record. A bundle dry-run found the recorded build
session but could not complete the MCP declaration. Declaring
`codex_tui=builtin` is rejected by this kit for the session's `source: vscode`
metadata, despite `originator: codex-tui` and version `0.172.0`. This needs a
valid declaration supported by the actual client or a correction from the
official tool. Neither the log nor the kit was modified to force acceptance.
The missing URL or launch command was not invented.

Transcript discovery was **dry-run only**. No transcript archive was created,
no private instruction text was exported, and nothing was uploaded. A local
loose-log check does not establish that an uploadable transcript package will
pass every requirement. Any eventual packaging must preserve the authentic
build record and respect private instruction boundaries.

The five submission-side checks require a public repository, proven ownership,
creation after the competition opened, a pushed commit, and a distinct source
snapshot. They have not been verified by the server.

Machine-readable diagnostics are kept outside the source repository at
`../research/thankful-validation/`. They describe the local working tree at
the time of checking, not a server grade or a signed submission.

## Network, account, and runtime limits

- Node fetches to make.fun failed with `EACCES`. The fresh requirements, live
  account, quota, and submission endpoint cannot be verified from this sandbox.
- An existing local credential record names `azykrie` and an expiry of
  21 December 2026. This is cached metadata, not proof that the newest browser
  approval was exchanged successfully or that the key is still accepted.
- The previous private login directory is unreadable here (`EPERM`).
  No access controls or sandbox settings were changed.
- Docker's daemon is unavailable, so no Node 22 Linux sandbox run was made.
  Passing on local Node 24 is not a substitute for the official runtime.
- The kit explicitly says there is no local grade for this competition.
  No official gate score or judge result has been obtained.
- A public GitHub repository has not been created or pushed. The README uses
  the proposed name `azykrie/thankful-entry` and states that it is provisional.

## Continue before submission

1. Use the existing verified make.fun and GitHub connections, with approved
   access to their private credential stores where needed. Recheck that the
   competition is still open, fees, and remaining quota before submitting.
   The verified requirements list no entry fee or additional prerequisites.
2. Resolve the authentic MCP/run-record declaration and permissible transcript
   packaging; never fake a log, usage record, endpoint, or system prompt.
3. Create the intended new public repository, or use the kit's official source
   bundle freshness flow. A plain local git repository is not that flow.
4. For GitHub, verify its actual owner/name, badges, About metadata and ownership
   proof, and push the exact source commit.
5. Rerun the program tests and official checks on the exact commit and final
   transcript package; then sign and submit through the official CLI.
6. Record the server receipt and follow its checks. Never infer acceptance,
   placement, or payout from local tests.

The downloaded rules set the entry deadline at **28 November 2026, 04:41 WIB**
(27 November 2026, 21:41 UTC). The live deadline must be rechecked.
