# Weft

**A Chrome extension that watches how a piece of office work is actually done, maps it, and points to the steps worth automating.** Everything stays on the user's computer.

## At a glance

| | |
|---|---|
| **Problem** | Operations teams guess where their processes waste time. Interviews and workshops describe the process people *think* they follow, recommendations stall before anyone builds them, and nobody checks afterwards whether the fix saved anything. |
| **What it does** | Someone records themselves doing a task (for example, onboarding a partner across a CRM and a KYC portal) a few times. Weft merges the recordings into one map showing the usual path and the exceptions, flags steps that look automatable or are bottlenecks, writes a brief for each opportunity, exports it as a Jira/Linear-ready ticket, and tracks the time saved once the fix ships. |
| **Status** | Working prototype (MVP). All 8 planned milestones are built. **Not yet tried with real users or design partners**, and not published to the Chrome Web Store. |
| **Evidence** | 159 automated tests pass and the extension builds; both run on GitHub for every change ([CI](.github/workflows/ci.yml)). |
| **Stack** | TypeScript, React, React Flow, Vite, Chrome Manifest V3. No server, no accounts, no network calls. |

## Who did what

**Bhawna Mangla**, product owner (GitHub [`bhawnamanglapm`](https://github.com/bhawnamanglapm)). Built with **Claude Code**, an AI coding assistant.

## How it works

1. **Consent first.** The extension is locked until the user reads what it records and what it never records.
2. **Record.** The user names a workflow and presses Start. Weft notes each click, form submit and page change: what kind of control was used, its label, the site and page path, and the time. Only the tab where recording started (and tabs opened from it) counts.
3. **Review.** When recording stops, the user sees every step it kept and can edit, redact or discard it. Only what they confirm is kept.
4. **Merge and map.** Several recordings of the same workflow are merged into one map: the main path, the branches, and how often each was taken.
5. **Suggest.** Each step is classified (data entry, copying between systems, lookup, approval, waiting for someone…). Fixed rules then suggest an automation or a process change, with an *estimated* time saving. No AI model is called.
6. **Brief and ticket.** An opportunity becomes a structured brief, exported as Markdown or JSON for Jira/Linear.
7. **Measure.** When a fix ships, the user records the actual saving, and Weft compares it with the estimate.

A full-page dashboard gives an overview across workflows.

## How privacy is enforced

These checks are built into the code, not just written down as policy:

- **Never recorded:** what anyone types, URL query strings, text from tables and other data areas, or screenshots. The code never reads a field's value.
- **Text that is kept is scrubbed when recorded:** emails, Indian PAN/GST numbers, and any number of 6 or more digits (account numbers, phone numbers, amounts).
- **Your edits on the review screen are what's stored.** A redacted label is removed from the stored raw clicks too, not just from the summary (fixed 18 Oct 2026, with tests).
- **No network code.** The source and the built extension contain no code that sends data anywhere.
- **No individual performance tracking.** Timing is used to find slow steps in the process, never to rate a person.

## Honest limits

- **No user validation yet.** There are no design partners, usage data or measured savings. Savings shown in the app are estimates from recorded timings and assumptions the user can edit (hourly cost, runs per month).
- **Names are not detected automatically.** A link or button whose visible text is a person's name (for example, a customer name in a list) is recorded as that name. The review screen is where the user catches it.
- **No "delete everything" button yet.** Discarded recordings are deleted; confirmed ones stay until the extension is uninstalled.
- **Browser checks aren't repeatable from this repo.** The automated tests cover the logic: splitting into steps, classification, merging, savings, briefs and redaction. The parts that run inside the browser were checked by driving Chrome with Playwright, but those scripts were not committed.
- [`reference/weft-mockup.html`](reference/weft-mockup.html) is an early **design mockup with made-up example data**, not output from the extension.

## Repository map

| File | What it is |
|---|---|
| [`weft-concept.md`](weft-concept.md) | Why this product: the problem, the approach, the business model idea |
| [`weft-prd.md`](weft-prd.md) | Product requirements (v2.0), with notes on what changed while building |
| [`BUILD.md`](BUILD.md) | The milestone-by-milestone build plan and each milestone's acceptance check |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | How it is built: components, data flow, algorithms, privacy model, known limitations |
| [`CLAUDE.md`](CLAUDE.md) | The rules any contributor (human or AI) must follow in this codebase |
| `src/` | The extension: `content/` records, `background/` stores, `reconstruct/` splits and merges, `sidepanel/` and `dashboard/` are the screens, `brief/` writes briefs and tickets |
| `test/` | Sample web pages for trying the recorder by hand |

## Try it

Needs Node 22.12 or later and Google Chrome.

```bash
npm ci
npm run build    # creates dist/
npm test         # runs the automated tests
```

Then in Chrome, open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked**, and choose the `dist` folder. Click the Weft icon in the toolbar to open the side panel. The pages in `test/` are safe sample pages to record on.

`npm run dev` runs a development build that reloads as you edit.

## License

[MIT](LICENSE)
