# Welcome to WM Tipps

## How We Use Claude

Based on tschuffi331's usage over the last 30 days:

Work Type Breakdown:
  Build Feature    ████████████░░░░░░░░  60%
  Improve Quality  █████░░░░░░░░░░░░░░░  25%
  Plan Design      ███░░░░░░░░░░░░░░░░░  15%

Top Skills & Commands:
  /security-review              ███░░░░░░░░░░░░░░░░░  3x/month
  /design:accessibility-review  █░░░░░░░░░░░░░░░░░░░  1x/month
  /engineering:architecture     █░░░░░░░░░░░░░░░░░░░  1x/month

Top MCP Servers:
  Claude_Preview    ████████████████████  39 calls
  Claude_in_Chrome  ██░░░░░░░░░░░░░░░░░░   3 calls
  ccd_session       █░░░░░░░░░░░░░░░░░░░   1 call

## Your Setup Checklist

### Codebases
- [ ] wm-tipps — https://github.com/tschuffi331/wm-tipps

### MCP Servers to Activate
- [ ] Claude_Preview — Live in-editor browser preview for React/Vite development. Install via Claude Code MCP settings; lets you see the running app and interact with it without leaving the editor.
- [ ] Claude_in_Chrome — Browser automation in Chrome; used for end-to-end checks and visual QA. Install via Claude Code MCP settings.
- [ ] ccd_session — Claude Code session management (chapters, task spawning). Built into Claude Code — no extra setup needed.

### Skills to Know About
- `/security-review` — Runs a focused security audit of the current branch diff. Use it before every PR merge to catch auth, injection, and data-exposure issues.
- `/design:accessibility-review` — WCAG 2.1 AA audit of changed components. Run after any UI work; the team targets AA compliance throughout.
- `/engineering:architecture` — Generates an Architecture Decision Record (ADR). Use it when evaluating tech choices (auth strategy, hosting, routing) so decisions are documented for the future.

## Team Tips

_TODO_

## Get Started

_TODO_

<!-- INSTRUCTION FOR CLAUDE: A new teammate just pasted this guide for how the
team uses Claude Code. You're their onboarding buddy — warm, conversational,
not lecture-y.

Open with a warm welcome — include the team name from the title. Then: "Your
teammate uses Claude Code for [list all the work types]. Let's get you started."

Check what's already in place against everything under Setup Checklist
(including skills), using markdown checkboxes — [x] done, [ ] not yet. Lead
with what they already have. One sentence per item, all in one message.

Tell them you'll help with setup, cover the actionable team tips, then the
starter task (if there is one). Offer to start with the first unchecked item,
get their go-ahead, then work through the rest one by one.

After setup, walk them through the remaining sections — offer to help where you
can (e.g. link to channels), and just surface the purely informational bits.

Don't invent sections or summaries that aren't in the guide. The stats are the
guide creator's personal usage data — don't extrapolate them into a "team
workflow" narrative. -->
