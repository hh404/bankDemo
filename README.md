# Bank Demo — INFT Transfer

Web mock of an iOS-style bank app **Payment → Transfer** flow: **INFT instant transfer** (From → To → Amount → Review → Result). All copy is in English.

## Flow

1. **Transfer home** → Choose "INFT instant transfer"
2. **From** → Select debit account
3. **To** → Select beneficiary
4. **Amount** → Enter amount and next
5. **Review** → Confirm or back to edit
6. **Result** → Success/failure, download receipt/screen, transfer again or retry

## Cases & demo scenarios

### From (debit account)

| Case | How to trigger | UI behavior |
|------|----------------|-------------|
| **Empty (no accounts)** | Open `/transfer/from?from=empty` | Empty state: "No accounts", "Open an account" CTA, demo hint for `?from=empty` |
| **Loading** | Navigate to From (first load) | "Loading…", "Fetching your accounts" |
| **Load error** | Simulated on request failure | Red message + "Retry" |
| **List not full screen** | Normal load with few items | Content fits; layout has space below, no scroll |
| **List scrollable** | Normal load (8 accounts) | Main area scrolls; header fixed; use narrow viewport to see scroll |
| **Active account** | Choose Savings / Current / etc. | Selectable, chevron or check |
| **Frozen account** | Choose "Frozen Savings" | Disabled, orange "Frozen" label |
| **Suspended account** | Choose "Suspended" | Disabled, red "Suspended" label |
| **Zero balance (active)** | Choose "Payroll" | Disabled, "Insufficient balance" |

### To (beneficiary)

| Case | How to trigger | UI behavior |
|------|----------------|-------------|
| **Loading** | After selecting From | "Loading…" |
| **Load error** | Simulated on failure | Red message + "Retry" |
| **No beneficiaries** | Use mock that returns `[]` | "No beneficiaries", "Add beneficiary" (demo alert) |
| **Same account (self)** | Select From ending **** 8821, then "Myself" (**** 8821) | Row disabled, "Cannot transfer to self" |
| **Verified** | John Smith / Jane Doe / Myself | Green "Verified" badge |
| **Unverified** | Bob Wilson | No badge |

### Amount

| Case | How to trigger | UI behavior |
|------|----------------|-------------|
| **Below minimum** | Enter &lt; 1 | Error: "Minimum 1 CNY" |
| **Insufficient balance** | Amount &gt; account balance | "Insufficient balance" |
| **Exceeds daily limit** | Amount &gt; daily remaining | "Exceeds daily limit" |
| **Over single limit** | Amount &gt; 50,000 | "Maximum ... CNY" |
| **Transfer all** | Tap "Transfer all" | Fills max(balance, daily remaining, 50k) |
| **Valid amount** | Within limits | "Next" enabled |

### Review

| Case | How to trigger | UI behavior |
|------|----------------|-------------|
| **Summary** | From / To / Amount / optional Remark | All shown, "Confirm transfer" |
| **Processing** | Tap "Confirm transfer" | Button "Processing…", disabled |
| **Back to edit** | Tap "Back to edit" | Returns to Amount |

### Result

| Case | How to trigger | UI behavior |
|------|----------------|-------------|
| **Success** | Submit (≈85% in demo) | Green check, "Transfer successful", receipt details, "Download receipt", "Download screen", "Transfer again", "Back to transfer" |
| **Failure** | Submit (≈15% simulated fail) | Red X, "Transfer failed", error message, "Retry" (to Review), "Back to transfer" |
| **Download receipt** | Tap "Download receipt (image)" | PNG of receipt block only |
| **Download screen** | Tap "Download screen" or nav "Screenshot" | PNG of full screen |

### Screenshot (any screen)

- **Nav "Screenshot"** on From / To / Amount / Review / Transfer home: downloads current screen as PNG.

## Screenshot download

- Every screen with **"Screenshot"** in the nav bar can download the current view as PNG.
- Result screen also has **"Download receipt (image)"** (receipt block) and **"Download screen"** (full layout).

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Use a narrow viewport or DevTools device mode to see scroll and mobile layout.

## Tech

- React 18 + TypeScript
- Vite
- React Router 6
- html2canvas (screen/receipt export)
