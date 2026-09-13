---
description: API design docs — where interface contracts are written before and while they are implemented
---

# API docs

Interface contracts: endpoints, request/response shapes, error codes, and the invariants callers rely on. Write the contract here when designing an interface, keep it current while the interface lives.

## Conventions

- One document per API surface (or per version of it), not per endpoint
- Every field listed with type, meaning, and whether it's optional
- Error responses enumerated with their meanings — no "and various errors"
