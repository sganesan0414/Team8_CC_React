# CareConnect - React Native Healthcare Application

A comprehensive healthcare management application built with React Native and Expo, designed to help patients manage medications, appointments, health metrics, and communication with their care teams.

## 📱 Project Overview

**Framework:** React Native 0.81.5 with Expo SDK 54  
**Language:** TypeScript 5.9.2  
**State Management:** Zustand 5.0.14  
**Navigation:** React Navigation 6.1.17  
**Build System:** Expo + Metro Bundler + Gradle (Android)

### Key Features

- **Authentication** - Email/password login with biometric (fingerprint/face) and PIN options
- **Medication Management** - Track medications, adherence rates, and refill schedules
- **Appointments** - Schedule and manage healthcare appointments
- **Health Metrics** - Log and track health vitals and measurements
- **Health Reports** - Generate and view health reports
- **Care Team** - Manage emergency contacts and care team members
- **Pharmacy Integration** - Connect with pharmacy services
- **Reminders** - Medication and appointment reminders

---

## ♿ Accessibility

All 22 UI-bearing files (7 shared components, 10 screens, 5 dashboard tabs) have
`accessibilityRole`/`accessibilityLabel`/`accessibilityHint`/`accessibilityState`
applied, validated against React Native's actual `AccessibilityRole` type (`tsc
--noEmit` passes with 0 errors) and against the full test suite (204 tests
passing).

**TalkBack (Android)** has been verified manually on a real Android 14 emulator
via Expo Go — navigation, labels, roles, hints, and focus order announced as
expected. **VoiceOver (iOS)** has not been tested — it requires a Mac (Xcode
Simulator) or physical iOS device, neither available in this environment.
There is also no automated accessibility-specific test coverage — that's still
an open item.

See:
- [WCAG_COMPLIANCE_REPORT.md](WCAG_COMPLIANCE_REPORT.md) — criterion-by-criterion status, including what's honestly marked partial or not done
- [ACCESSIBILITY_AUDIT.md](ACCESSIBILITY_AUDIT.md) — gaps found and fixed, including defects in code previously marked "complete"
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) — full file list and the patterns used
- [REVIEW_GUIDE.md](REVIEW_GUIDE.md) — short reviewer checklist

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 20.19.4+ and npm (required by React Native 0.81)
- No global Expo CLI install needed — `npx expo` (bundled with the `expo` package) is the supported way to run CLI commands; the old standalone `expo-cli` package is deprecated
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

```bash
# Clone repository
cd careconnect-react

# Install dependencies
npm install

# Start development server
expo start

# Run on iOS
expo start --ios

# Run on Android
expo start --android
```

---

## 🏗️ Project Structure

```
careconnect-react/
├── src/
│   ├── components/          # 7 UI components
│   │   ├── AppBar.tsx
│   │   ├── BottomNav.tsx
│   │   ├── StatCard.tsx
│   │   ├── AlertBanner.tsx
│   │   ├── Select.tsx
│   │   ├── Toast.tsx
│   │   └── ContextBar.tsx
│   ├── screens/             # 5+ screen components
│   │   ├── LoginScreen.tsx
│   │   ├── CreateAccountScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── HealthMetricsScreen.tsx
│   │   └── ...
│   ├── tabs/                # 5 tab components
│   │   ├── HomeTab.tsx
│   │   ├── MedicationsTab.tsx
│   │   ├── AppointmentsTab.tsx
│   │   ├── CareTeamTab.tsx
│   │   └── RemindersTab.tsx
│   ├── store/               # Zustand state management
│   │   ├── accountStore.ts
│   │   ├── medicationsStore.ts
│   │   ├── appointmentsStore.ts
│   │   └── ...
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── theme/               # Styling
│   │   └── styles.ts
│   └── App.tsx              # Root component
├── android/                 # Android native configuration
├── coverage/                # Test coverage reports
├── WCAG_COMPLIANCE_REPORT.md
├── ACCESSIBILITY_AUDIT.md
├── IMPLEMENTATION_SUMMARY.md
├── REVIEW_GUIDE.md
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🔧 Technology Stack

- **React Native** 0.81.5 - Mobile app framework
- **Expo** SDK 54 - Development platform
- **TypeScript** 5.9.2 - Type-safe JavaScript
- **Zustand** 5.0.14 - State management
- **React Navigation** 6.1.17 - Navigation library
- **Lucide React Native** 1.21.0 - Icon library
- **Jest** 29.7.0 - Testing framework
- **Expo Local Authentication** - Biometric authentication

---

## ✅ Accessibility Features

- Semantic roles (button, header, alert, etc.) and descriptive labels/hints on
  interactive elements, using only roles that exist in React Native's
  `AccessibilityRole` type
- Live region announcements for toasts and form errors
- Touch targets verified at 44×44pt minimum
- Color not used as the sole differentiator of state

"Visual focus indicators" and "keyboard navigation" are web/desktop concepts
without a direct equivalent on a touch-based mobile app — see
[WCAG_COMPLIANCE_REPORT.md](WCAG_COMPLIANCE_REPORT.md) for which criteria are
marked N/A for that reason, and which are implemented but not yet verified
with a real screen reader.

---

## 📝 Testing

### Run Tests
```bash
npm test
```

### View Coverage
Coverage reports available in `/coverage` directory

### Accessibility Testing
Manual testing with screen readers:
- iOS: VoiceOver (enable in Accessibility settings)
- Android: TalkBack (enable in Accessibility settings)

---

## 📄 License

This project is part of the SWEN 661 course at Rochester Institute of Technology.

---

## 🤝 Contributing

For accessibility improvements or bug fixes, please:

1. Review the [ACCESSIBILITY_AUDIT.md](ACCESSIBILITY_AUDIT.md) for known issues
2. Check the [WCAG_COMPLIANCE_REPORT.md](WCAG_COMPLIANCE_REPORT.md) for compliance details
3. Run `npx tsc --noEmit` — `accessibilityRole` values that aren't in React Native's
   actual type union will fail this check
4. Test with VoiceOver/TalkBack before claiming a fix works — implementation
   alone hasn't been device-verified in this codebase

---

## 📞 Support

For questions about accessibility compliance or implementation, refer to:
- [REVIEW_GUIDE.md](REVIEW_GUIDE.md) - Quick reference
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Detailed implementation notes
- [WCAG_COMPLIANCE_REPORT.md](WCAG_COMPLIANCE_REPORT.md) - Full compliance documentation

---

**Last Updated:** June 22, 2026
