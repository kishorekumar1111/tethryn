# Security Specification - Tethra

## Data Invariants
1. A Tethra must have a valid `authorId` that matches the creator's UID.
2. Only the author can update or delete their Tethra.
3. Once a Tethra is created, its `authorId` and `createdAt` fields are immutable.
4. Users can only read their own private Tethras, unless `isPublished` is true.
5. User profile data is restricted to the owner for privacy.

## The Dirty Dozen Payloads (Rejection Targets)

1. **Identity Spoofing**: Attempt to create a Tethra with `authorId: "someone_else_uid"`.
2. **PII Leak**: Attempt to read another user's profile document (`/users/OTHER_UID`).
3. **Ghost Field Injection**: Attempt to update a Tethra with `isVerifiedBySystem: true`.
4. **Mass Deletion**: Attempt to delete a Tethra owned by another user.
5. **State Shortcut**: Attempt to change `views` directly to `999999`.
6. **Immutable Breach**: Attempt to change `createdAt` timestamp of an existing Tethra.
7. **Resource Poisoning**: Attempt to use a 2MB string as a document ID for a Tethra.
8. **Unverified Write**: Attempt to create a Tethra without a verified email (if strict enforcement applied).
9. **Global Scraping**: Attempt to list all Tethras without the `isPublished == true` filter or owner filter.
10. **Null ID Bypass**: Attempting to read `/tethras/ ` (empty string/id).
11. **Type Mismatch**: Sending `views: "one million"` (string instead of number).
12. **orphaned Write**: Creating a Tethra without a valid template reference (though template IDs are hardcoded, we should validate string size).

## Test Runner Plan
We will simulate these attacks in the rule evaluation logic.
