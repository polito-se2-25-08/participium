# Technical Debt Strategy

## 1. Planning TD Management

### Our Current Technical Debt Strategy
We will adopt a proactive approach to reducing existing technical debt:

*   **Priorities:**
    1.  **Reliability (Currently: C - 16 issues):** This is our top priority. These issues represent potential bugs that could affect users. We aim to improve this to **B** by the end of the next sprint.
    2.  **Maintainability (Currently: A - 42 issues):** We aim to keep it at A with the new implementations.
    3.  **Hotspots Reviewed (Currently: E - 0.0%):** We need to work on hotspots to ensure they are safe.

*   **Internal Organization:**
    *   From now on for every sprint, one member of group will review SonarCloud reports weekly to identify trends and assign critical fixes.

## 2. Current SonarCloud Status (Sprint 2)

| Metric | Rating/Value | Status |
| :--- | :--- | :--- |
| **Security** | **A** (0 issues) | ✅ Excellent |
| **Reliability** | **C** (16 issues) | ⚠️ **Needs Attention** |
| **Maintainability** | **A** (42 issues) | ⚠️ Acceptable |
| **Hotspots Reviewed** | **E** (0.0%) | ❌ **Critical** |
| **Coverage** | **87.9%** | ✅ Excellent |
| **Duplications** | **0.0%** | ✅ Excellent |

---

## 3. Sprint 3 Update: Prioritized Remediation

### Strategy Shift
For Sprint 3, we shifted to a **Prioritized Remediation Strategy**. Instead of a general reduction, we aggressively targeted high-impact areas (Security and Reliability) to make their metrics higher.

* **Actions Taken:**
    * Focused strictly on resolving the 16 Reliability issues identified in Sprint 2.
    * Addressed Security Hotspots to improve the "E" rating.
    * Accepted a slight temporary dip in coverage (from 87.9% to 84.6%) to focus on refactoring complex logic.

### Sprint 3 Status Results
| Metric | Rating/Value | Status | Change |
| :--- | :--- | :--- | :--- |
| **Security** | **A** | ✅ Excellent | ➖ Stable |
| **Reliability** | **A** | ✅ Excellent | ⬆️ Improved from C |
| **Maintainability** | **A** | ✅ Excellent | ➖ Kept at A |
| **Hotspots Reviewed** | **A** | ✅ Excellent | ⬆️ Improved from E |
| **Coverage** | **84.6%** | ⚠️ Good | ⬇️ -3.3% |
| **Total Issues** | **35** | ✅ Good | ⬇️ Reduced from 58 |

---

## 4. Sprint 4 Update: Zero New Debt (Current)

### Current Strategy
With all metrics reaching "A" in Sprint 3, we adopted the **Zero New Debt Strategy** for Sprint 4. The goal changed from fixing old code to preserving the clean state while adding new features.

* **Priorities:**
    1.  **Preservation:** Maintain "A" ratings across the board.
    2.  **Coverage Recovery:** Increase coverage back towards the 88% range.
    3.  **Clean Slate:** Ensure no new Reliability or Security issues are introduced.

### Sprint 4 Status Results
We successfully reduced the total issue count further (from 35 to 8) solely by adhering to clean coding standards, even while adding new features.

| Metric | Rating/Value | Status | Trend (vs Sprint 3) |
| :--- | :--- | :--- | :--- |
| **Security** | **A** (0 issues) | ✅ Excellent | ➖ Stable |
| **Reliability** | **A** (0 issues) | ✅ Excellent | ➖ Stable |
| **Maintainability** | **A** (8 issues) | ✅ Excellent | ⬆️ Reduced from ~20+ |
| **Hotspots Reviewed** | **A** (100%) | ✅ Excellent | ➖ Stable |
| **Coverage** | **86.4%** | ✅ Excellent | ⬆️ +1.8% |
| **Total Issues** | **8** | ✅ Excellent | ⬆️ Reduced from 35 |