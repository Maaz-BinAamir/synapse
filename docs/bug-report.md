# Bug Report

## Verification Summary

I traversed the repository, identified high-risk authorization and ownership gaps, added targeted regression tests in `convex/security.unit.test.ts`, and executed the current full automated suite.

| Check | Command | Result |
| --- | --- | --- |
| Full automated suite | `npm run test:run` | 45 passed / 10 failed / 55 total |
| Security regression suite | `npm run test:unit -- convex/security.unit.test.ts` | 10 failed / 10 total |
| Current unit count | Derived from current test files | 40 unit tests |
| Current integration count | Derived from current test files | 15 integration tests |

## Root Cause Pattern

The confirmed defects are all caused by missing authentication or missing ownership validation in Convex handlers. Several queries and mutations trust client-supplied identifiers or expose user-owned records without verifying the caller.

## Confirmed Bugs

| Bug ID | Area | Severity | Status | Verified By |
| --- | --- | --- | --- | --- |
| BUG-001 | Diagnosis session guest access | Critical | Reproduced | `security.unit.test.ts` |
| BUG-002 | Diagnosis session cross-user access | Critical | Reproduced | `security.unit.test.ts` |
| BUG-003 | Quiz completion cross-user access | Critical | Reproduced | `security.unit.test.ts` |
| BUG-004 | Quiz results cross-user access | Critical | Reproduced | `security.unit.test.ts` |
| BUG-005 | Followers identity spoofing | High | Reproduced | `security.unit.test.ts` |
| BUG-006 | Quiz questions cross-user access | Critical | Reproduced | `security.unit.test.ts` |
| BUG-007 | Quiz answer submission cross-user access | Critical | Reproduced | `security.unit.test.ts` |
| BUG-008 | Quiz results guest access | Critical | Reproduced | `security.unit.test.ts` |
| BUG-009 | Quiz questions guest access | Critical | Reproduced | `security.unit.test.ts` |
| BUG-010 | Quiz completion guest access | Critical | Reproduced | `security.unit.test.ts` |

---

## BUG-001: Guests can read diagnosis sessions without authentication

| Field | Details |
| --- | --- |
| File | `convex/diagnosisSession.ts` |
| Function | `get()` |
| Severity | Critical |
| Type | Authorization bypass / privacy leak |
| Expected Behavior | Only the owning authenticated user should be able to read a diagnosis session. |
| Actual Behavior | An unauthenticated caller can query a diagnosis session directly and receive the stored record. |
| Reproduction Test | `prevents guests from reading a diagnosis session` |
| Observed Failure | The test expected rejection with `Not authenticated`, but the query resolved with the full session object including `userId` and `disease`. |

## BUG-002: Any authenticated user can read another user's diagnosis session

| Field | Details |
| --- | --- |
| File | `convex/diagnosisSession.ts` |
| Function | `get()` |
| Severity | Critical |
| Type | Broken object-level authorization |
| Expected Behavior | Only the session owner should be able to fetch their diagnosis session. |
| Actual Behavior | A different authenticated user can fetch another user's diagnosis session. |
| Reproduction Test | `prevents another user from reading someone else's diagnosis session` |
| Observed Failure | The test expected rejection with `Session not found or access denied`, but the query resolved with the owner’s session object. |

## BUG-003: Any authenticated user can finish another user's quiz

| Field | Details |
| --- | --- |
| File | `convex/quiz.ts` |
| Function | `finishQuiz()` |
| Severity | Critical |
| Type | Broken object-level authorization / integrity violation |
| Expected Behavior | Only the quiz owner should be able to complete and score the quiz. |
| Actual Behavior | A different authenticated user can call `finishQuiz()` on someone else’s quiz ID and the mutation succeeds. |
| Reproduction Test | `prevents another user from finishing someone else's quiz` |
| Observed Failure | The test expected rejection with `Quiz not found or access denied`, but the mutation resolved successfully. |

## BUG-004: Any authenticated user can read another user's quiz results

| Field | Details |
| --- | --- |
| File | `convex/quiz.ts` |
| Function | `getQuizResults()` |
| Severity | Critical |
| Type | Broken object-level authorization / privacy leak |
| Expected Behavior | Quiz results should only be visible to the quiz owner. |
| Actual Behavior | A different authenticated user can fetch the full result payload, including questions, selected options, correctness flags, and score metadata. |
| Reproduction Test | `prevents another user from reading someone else's quiz results` |
| Observed Failure | The test expected rejection with `Quiz not found or access denied`, but the query resolved with the quiz summary and results array. |

## BUG-005: A user can spoof another follower identity

| Field | Details |
| --- | --- |
| File | `convex/followers.ts` |
| Function | `followUsers()` |
| Severity | High |
| Type | Identity spoofing / integrity issue |
| Expected Behavior | The authenticated user should only be able to create follow relationships where `followerId === identity.subject`. |
| Actual Behavior | Any authenticated user can submit arbitrary `followerId` and create follow relationships on behalf of another user. |
| Reproduction Test | `prevents a user from spoofing another follower identity` |
| Observed Failure | The test expected rejection with `Follower identity does not match authenticated user`, but the mutation resolved successfully. |

## BUG-006: Any authenticated user can read another user's quiz questions

| Field | Details |
| --- | --- |
| File | `convex/quiz.ts` |
| Function | `getQuizQuestions()` |
| Severity | Critical |
| Type | Broken object-level authorization / content exposure |
| Expected Behavior | Only the quiz owner should be able to read the question set bound to that quiz attempt. |
| Actual Behavior | A different authenticated user can fetch another user's quiz questions by quiz ID. |
| Reproduction Test | `prevents another user from reading someone else's quiz questions` |
| Observed Failure | The test expected rejection with `Quiz not found or access denied`, but the query resolved with the quiz questions array. |

## BUG-007: Any authenticated user can submit answers to another user's quiz

| Field | Details |
| --- | --- |
| File | `convex/answers.ts` |
| Function | `submitAnswer()` |
| Severity | Critical |
| Type | Broken object-level authorization / integrity violation |
| Expected Behavior | Only the quiz owner should be able to write selected answers for that quiz. |
| Actual Behavior | A different authenticated user can submit an answer for another user's quiz and mutate the stored `quizQuestions` record. |
| Reproduction Test | `prevents another user from submitting answers to someone else's quiz` |
| Observed Failure | The test expected rejection with `Quiz not found or access denied`, but the mutation resolved and returned a `quizQuestions` document id. |

## BUG-008: Guests can read quiz results without authentication

| Field | Details |
| --- | --- |
| File | `convex/quiz.ts` |
| Function | `getQuizResults()` |
| Severity | Critical |
| Type | Authorization bypass / privacy leak |
| Expected Behavior | Guests should be rejected before quiz results are returned. |
| Actual Behavior | An unauthenticated caller can fetch quiz summary and result data by quiz ID. |
| Reproduction Test | `prevents guests from reading quiz results` |
| Observed Failure | The test expected rejection with `Not authenticated`, but the query resolved with the quiz summary and results array. |

## BUG-009: Guests can read quiz questions without authentication

| Field | Details |
| --- | --- |
| File | `convex/quiz.ts` |
| Function | `getQuizQuestions()` |
| Severity | Critical |
| Type | Authorization bypass / content exposure |
| Expected Behavior | Guests should be rejected before quiz questions are returned. |
| Actual Behavior | An unauthenticated caller can fetch the quiz question set by quiz ID. |
| Reproduction Test | `prevents guests from reading quiz questions` |
| Observed Failure | The test expected rejection with `Not authenticated`, but the query resolved with the quiz questions array. |

## BUG-010: Guests can finish quizzes without authentication

| Field | Details |
| --- | --- |
| File | `convex/quiz.ts` |
| Function | `finishQuiz()` |
| Severity | Critical |
| Type | Authorization bypass / integrity violation |
| Expected Behavior | Guests should be rejected before a quiz can be completed or scored. |
| Actual Behavior | An unauthenticated caller can call `finishQuiz()` and the mutation resolves successfully. |
| Reproduction Test | `prevents guests from finishing a quiz` |
| Observed Failure | The test expected rejection with `Not authenticated`, but the mutation resolved successfully. |

## Regression Test File

| File | Purpose | Current Result |
| --- | --- | --- |
| `convex/security.unit.test.ts` | Encodes expected secure behavior for these authorization and ownership checks | 10 failing regression tests |

## Recommended Fixes

| Priority | Recommendation |
| --- | --- |
| P0 | Add authentication and ownership checks to `diagnosisSession.get()`. |
| P0 | Add authentication and ownership checks to `quiz.finishQuiz()`. |
| P0 | Add authentication and ownership checks to `quiz.getQuizResults()`. |
| P0 | Add authentication and ownership checks to `quiz.getQuizQuestions()`. |
| P0 | Add authentication and ownership checks to `answers.submitAnswer()` by resolving the quiz owner before mutating answer state. |
| P1 | Derive `followerId` from `identity.subject` inside `followUsers()` and `unfollowUsers()` instead of trusting client input. |
| P1 | Keep the 10 regression tests as permanent coverage after the fixes are implemented. |

## Execution Evidence

| Metric | Result |
| --- | --- |
| Unit tests | 40 |
| Integration tests | 15 |
| Total automated tests | 55 |
| Passed | 45 |
| Failed | 10 |
| Confirmed bug regressions | 10 |
