# State Medicaid Agency Interoperability Hub

This repository publishes a static GitHub Pages hub for State Medicaid Agency provider directory and interoperability endpoint information.

The site supports three paths:

- Public overview of SMA provider directory and interoperability resources.
- Searchable endpoint directory for Patient Access, Provider Directory API, Provider Access, Payer-to-Payer, and Prior Authorization records.
- Update request workflow for state and CMS review by form-generated email or workbook download.

## Source Of Truth

`SMAEndpointDirectory.xlsx` is the canonical data source.

The legacy CSV has been removed. Browser data in `assets/directory-data.js` is generated from the workbook and should not be edited by hand.

## Regenerate Site Data

Run this after updating `SMAEndpointDirectory.xlsx`:

```powershell
& "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" scripts/build-directory-data.py
```

Expected output:

```text
Wrote assets\directory-data.js with 56 states and 280 endpoint records.
```

## Local Preview

From the repository root:

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080/`.

## Accessibility Notes

The hub is designed toward Section 508 and CMS Design System alignment with semantic landmarks, skip link, visible focus states, labeled form controls, scoped table headers, text status labels, error summary, and responsive reflow.

Do not claim full 508 compliance without automated scans and manual keyboard, focus, screen reader/name-role-value, contrast, and responsive checks.

## Contact

For questions about Medicaid interoperability initiatives or workbook updates, email `SMAendpointDirectory@cms.hhs.gov`.
