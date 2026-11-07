---
description: Optional guidance for developing batch or repetitive-task tools — use a worked sample when processing rules or batch effects need confirmation
---

# Automation tools — optional guidance

Use this reference when developing tools for batch or repetitive tasks, such as data conversion, report generation, or file processing. It adds no gate to ordinary feature development or the general review checklist. The user's requirements and existing project workflow and conventions take precedence over this reference.

## When a sample helps

Complete one small unit directly when processing rules, expected results, or batch effects need confirmation. Reuse suitable existing tools and established rules; do not manufacture a new sample when they already provide sufficient evidence. Include any new tooling in the task's design scope.

The agent can produce the sample from known requirements. Clarify unresolved business rules rather than inventing them. A sample is a worked result, not necessarily an automated test or a separate file.

For example, before generating sales reports, calculate one store's total from a few transactions and confirm how refunds affect it. That result gives the report generator something checkable to match.

## Implement and verify

Compare the tool's output with the checked result. Where batch effects matter, verify a small batch before wider execution. Follow the project's existing authorization and safety rules for execution.

## Keep only useful samples

Keep samples needed for regression with the owning tool's or module's tests: small cases inline, larger inputs and expected outputs as fixtures under existing conventions. Temporary working examples need not become maintained files. Do not create a project-wide sample directory for this method or retain a second implementation of the tool.
