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

## 2. Current SonarCloud Status

| Metric | Rating/Value | Status |
| :--- | :--- | :--- |
| **Security** | **A** (0 issues) | ✅ Excellent |
| **Reliability** | **C** (16 issues) | ⚠️ **Needs Attention** |
| **Maintainability** | **A** (42 issues) | ⚠️ Acceptable |
| **Hotspots Reviewed** | **E** (0.0%) | ❌ **Critical** |
| **Coverage** | **87.9%** | ✅ Excellent |
| **Duplications** | **0.0%** | ✅ Excellent |
