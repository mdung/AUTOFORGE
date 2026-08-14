# ADR-005: Secure Customer Approval Links

## Status: Accepted

## Context
Customers must approve repair estimates via a link sent by SMS/Email. This link must be secure, time-limited, and not expose other customers' data.

## Decision
Use `SecureLinkService` to generate signed approval URLs:
1. Links contain: resource ID + expiry timestamp + HMAC-SHA256 signature
2. Signature is computed from `resourceId + expiryTime + serverSalt`
3. Links are validated server-side before processing approval
4. Links are revoked after successful use (single-use enforcement)
5. Expired links are rejected

## Security Properties
- **Non-guessable**: SHA-256 signature prevents URL forgery
- **Time-limited**: Expiry timestamp checked server-side
- **Scoped**: Link only grants access to specific estimate
- **Revocable**: Used links are added to revocation set
- **No authentication required**: Guest access to specific resource only

## Consequences
- **Positive**: Customer doesn't need an account to approve
- **Positive**: Cannot access other customers' data
- **Negative**: In-memory revocation set (not persistent across restarts — acceptable for MVP)
