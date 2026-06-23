# WCAG 2.1 Level AA Compliance Report
## CareConnect React Native Healthcare Application

This reflects the implementation status against the WCAG 2.1 success criteria as
applied to a React Native mobile app. Status reflects what's implemented in code;
items marked "not device-verified" have not been tested with an actual screen
reader and should be treated as unverified, not passing.

**Android (TalkBack):** verified manually with real TalkBack (Android
Accessibility Suite) on an Android 14 emulator (Pixel 6, API 34), running the
app through Expo Go. Navigation, labels, roles, hints, and focus order were
confirmed to announce as expected.

**iOS (VoiceOver):** not tested. VoiceOver requires a Mac (Xcode Simulator) or
a physical iOS device, neither of which is available in this environment.
Criteria below marked "verified with TalkBack" cover Android only — treat iOS
as unverified.

## Compliance Checklist

### Perceivable

| Criterion | Status | Details |
|-----------|--------|---------|
| 1.1.1 Non-text Content | Implemented, verified with TalkBack | Icons/images have `accessibilityRole="image"` with descriptive labels |
| 1.3.1 Info & Relationships | Implemented, verified with TalkBack | Form labels and roles present on all input screens |
| 1.3.2 Meaningful Sequence | Implemented | DOM/render order matches visual order |
| 1.3.3 Sensory Characteristics | Implemented | Instructions don't rely on color/shape alone |
| 1.4.1 Use of Color | Implemented | Status is also conveyed via text/icon, not color alone |
| 1.4.2 Audio Control | N/A | No audio content |
| 1.4.3 Contrast (Minimum) | Implemented, not independently re-verified for every color pair | `BottomNav` inactive-tab color (#4B5563 on white) calculated ≈7.5:1; other pairs not individually recomputed |
| 1.4.4 Resize Text | Default platform behavior | No `allowFontScaling={false}` anywhere, so system text scaling works; this is React Native's default, not something explicitly implemented |
| 1.4.5 Images of Text | N/A | No images of text |
| 1.4.10 Reflow | Implemented | Layout uses flex/percentages, no fixed-width overflow |
| 1.4.11 Non-text Contrast | Not verified | No contrast check performed on UI chrome (borders, icons) |
| 1.4.13 Content on Hover/Focus | N/A | No hover-triggered content on mobile touch |

### Operable

| Criterion | Status | Details |
|-----------|--------|---------|
| 2.1.1 Keyboard (screen reader equivalent) | Implemented, verified with TalkBack | All interactive elements have `accessibilityRole`/label for assistive-tech activation; touch-explore + double-tap activation confirmed working |
| 2.1.2 No Keyboard Trap | Implemented | No custom focus traps; modals close via documented dismiss controls |
| 2.2.1/2.2.2 Timing | N/A | No timed content |
| 2.3.1 Three Flashes | N/A | No flashing content |
| 2.4.3 Focus Order | Implemented, verified with TalkBack | Render order is logical top-to-bottom; swipe-based linear navigation confirmed to follow that order |
| 2.4.4 Link Purpose | Implemented | All buttons have descriptive `accessibilityLabel` |
| 2.4.6 Headings and Labels | Implemented | Screen titles and section headers use `accessibilityRole="header"`; form fields have visible labels |
| 2.4.7 Focus Visible | N/A | "Visible focus indicator" is a web/keyboard concept; React Native mobile apps don't expose an equivalent through this API |
| 2.5.3 Label in Name | Implemented | Visible button text matches `accessibilityLabel` |
| 2.5.5 Target Size | Implemented | All touch targets verified ≥44×44pt in code (BottomNav tabs 60pt, buttons checked individually) |

### Understandable

| Criterion | Status | Details |
|-----------|--------|---------|
| 3.1.1 Language of Page | Implemented | App content is English; no in-app language switching |
| 3.2.3/3.2.4 Consistent Navigation/Identification | Implemented | Shared `AppBar`/`BottomNav`/`ContextBar` components used throughout |
| 3.3.1 Error Identification | Implemented | Validation errors rendered with `accessibilityRole="alert"` and `accessibilityLiveRegion` |
| 3.3.2 Labels or Instructions | Implemented | All form `TextInput`s have `accessibilityLabel` and `accessibilityHint` |
| 3.3.3 Error Suggestion | Partial | Error messages state the problem (e.g. "Passwords do not match") but don't always suggest a fix |
| 3.3.4 Error Prevention | Not implemented | No confirmation step on sign-out or destructive actions (e.g. removing a care team member, cancelling an appointment) |

### Robust

| Criterion | Status | Details |
|-----------|--------|---------|
| 4.1.1 Parsing | Implemented | TypeScript compiles cleanly (`tsc --noEmit`, 0 errors) |
| 4.1.2 Name, Role, Value | Implemented | All interactive components have `accessibilityLabel` + a role from React Native's actual `AccessibilityRole` union — verified against the type definitions, not just assumed |
| 4.1.3 Status Messages | Implemented, verified with TalkBack | Toasts and inline errors use `accessibilityLiveRegion` |

## What this report does not claim

- VoiceOver (iOS) has not been tested — no Mac/iOS device available in this
  environment. Only Android/TalkBack has been device-verified.
- No automated accessibility test suite exists (see `ACCESSIBILITY_AUDIT.md`).
- Several criteria above (3.3.3, 3.3.4) are openly listed as partial or not
  implemented rather than marked PASS.
