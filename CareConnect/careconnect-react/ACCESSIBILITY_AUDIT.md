# Accessibility Audit Report — WCAG 2.1 Level AA

**Project:** CareConnect React Native App

## Summary

An earlier pass added accessibility props to 13 files (7 UI components + 6 screens)
but left 9 files — 5 screens and 4 tabs — completely untouched, despite documentation
claiming app-wide compliance. That pass also introduced several real defects:
invalid `accessibilityRole` values that don't exist in this React Native version's
type definitions (`"form"`, `"navigation"`, `"dialog"`, `"option"`), and `accessible={true}`
set on the top-level `ScrollView` of the Login and Create Account screens — which, in
React Native, collapses the entire subtree into one opaque accessibility node and makes
every nested input and button unreachable by screen reader swipe navigation. A
verification pass also found that `CreateAccountScreen.tsx` was missing its submit
button entirely (an unrelated regression from that same edit, restored separately).

This pass closes the remaining coverage, fixes the invalid roles, and fixes the
`accessible={true}` grouping bug.

## What was fixed

### Coverage — previously untouched files

| File | Notes |
|------|-------|
| `screens/ForgotPasswordScreen.tsx` | Full 3-step email/password-reset flow had zero accessibility props |
| `screens/PinScreen.tsx` | PIN keypad (auth-critical) had no labels; the glyph-only "⌫" key was unreadable to screen readers |
| `screens/HealthReportsScreen.tsx` | Report generation form and list |
| `screens/PharmacyScreen.tsx` | Refill list and pharmacy info card |
| `screens/UserProfileScreen.tsx` | Profile edit form |
| `tabs/AppointmentsTab.tsx` | Appointment list, add form, detail modal |
| `tabs/CareTeamTab.tsx` | Member list, add form, emergency-contact toggle |
| `tabs/MedicationsTab.tsx` | Search field, medication list, "mark taken" action |
| `tabs/RemindersTab.tsx` | Reminder list, add form, enable/disable toggle |

All interactive elements in these files now have `accessible`, `accessibilityRole`,
`accessibilityLabel`, and `accessibilityHint`/`accessibilityState` as appropriate.

### Role misuse in the previously "complete" files

- `accessibilityRole="search"` was applied to plain email login/signup fields
  (`LoginScreen.tsx`, `CreateAccountScreen.tsx`). `search` is for actual search
  inputs; it was removed. (It's used correctly on `MedicationsTab.tsx`'s real
  search field.)
- `accessibilityRole="none"` was applied to password/name/numeric `TextInput`s,
  which strips the field's native editable-text semantics. Removed — `TextInput`
  doesn't need an explicit role; the native control already exposes itself
  correctly.
- `accessibilityRole="header"` was applied to `StatCard`'s numeric value text —
  a stat number isn't a heading. Removed.

### Invalid `accessibilityRole` values (caused `tsc` failures)

`"form"`, `"navigation"`, `"dialog"`, and `"option"` are not in this React Native
version's `AccessibilityRole` type union. These were present in the original
"complete" files (`ContextBar.tsx`, `Select.tsx`, `LoginScreen.tsx`,
`CreateAccountScreen.tsx`) — meaning the prior claim of "0 compilation errors" was
incorrect from the start. Fixed by removing the invalid role where no real
equivalent exists, or swapping to a valid one (`"option"` → `"menuitem"`).

### `accessible={true}` swallowing nested controls

`LoginScreen.tsx` and `CreateAccountScreen.tsx` wrapped their entire form in a
`ScrollView` with `accessible={true}` and an explicit `accessibilityLabel`. In
React Native this merges the whole subtree into a single accessibility node —
every individually-labeled `TextInput` and button inside becomes unreachable by
screen reader navigation. This directly contradicts the correct pattern used
elsewhere in the same codebase (e.g. `BottomNav`'s `accessible={false}` wrapper
around individually-focusable tabs). Removed the grouping; added
`accessibilityRole="header"` to each screen's title text instead.

### Touch target

`DashboardScreen.tsx`'s Settings button was `padding: 10` around a 22px icon
(≈42×42pt) — under the 44×44pt minimum the original docs claimed was met
everywhere. Changed to `padding: 11` with explicit `minWidth`/`minHeight: 44`.

### Color contrast

`BottomNav.tsx`'s inactive tab color is `#4B5563` on white, independently
calculated at ≈7.5:1 — passes the 4.5:1 AA minimum (the original `#9CA3AF` was
≈2.5:1, a real failure). Note: exact contrast ratios cited in the original docs
were not independently computed and should not be treated as measured values.

## What is NOT done

- **No automated accessibility tests exist.** No Jest assertions check for
  accessibility props, roles, or contrast. This was previously and inconsistently
  claimed as both "remaining work" and "complete" across the three docs — it is
  not complete.
- **VoiceOver (iOS) has not been tested.** VoiceOver requires a Mac (Xcode
  Simulator) or physical iOS device; neither is available in this environment.
- **TalkBack (Android) has been tested.** Verified manually with real TalkBack
  on an Android 14 emulator (Pixel 6, API 34) via Expo Go — navigation, labels,
  roles, hints, and focus order announced as expected. See
  `WCAG_COMPLIANCE_REPORT.md` for which criteria that covers.
- Some criteria don't map cleanly onto a mobile app (e.g. "Focus Visible" is a
  web/keyboard concept); see `WCAG_COMPLIANCE_REPORT.md` for which items are
  marked N/A rather than PASS for this reason.
