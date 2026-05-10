# Test Execution Report

Executed on 2026-05-09 in `D:\code\Web Dev\synapse`.

Coverage summary:

| Metric | Result |
| --- | --- |
| Statements | 94.89% |
| Branches | 80.70% |
| Functions | 95.58% |
| Lines | 94.83% |

## Unit Test

Latest suite verification: `npm run test:run`.

| Metric | Result |
| --- | --- |
| Unit test files | 7 |
| Unit tests total | 40 |
| Unit tests passed | 30 |
| Unit tests failed | 10 |

| Test ID | Module Name | Function Name | Test Description | Preconditions | Input / Test Data | Expected Output | Actual Output | Pass/Fail | Remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UT-001 | Chat API Route | `POST()` | Reject unauthenticated chat request | Auth mock returns false | `{}` request to `/api/chat` | HTTP 401 with `Unauthorized` body | Returned `401 Unauthorized` | Pass | Auth guard verified |
| UT-002 | Chat API Route | `POST()` | Reject invalid payload without required fields | Auth mock returns true | `{ messages: [] }` | HTTP 400 with validation message | Returned `400 Invalid request payload` | Pass | Request validation branch |
| UT-003 | Chat API Route | `POST()` | Reject request when diagnosis session is missing | Auth mock returns true; `fetchQuery` returns `null` | `{ sessionId: "session-1", messages: [{ id: "1", role: "user", parts: [] }] }` | HTTP 404 with not found message | Returned `404 Diagnosis session not found` | Pass | Missing session handling |
| UT-004 | Chat API Route | `POST()` | Stream response for valid chat request | Auth mock returns true; diagnosis session disease exists | Valid chat payload with `sessionId` and `messages` | Return stream response configured with model and system prompt | Returned mocked stream response; system prompt contained `Malaria` | Pass | AI SDK and Groq mocks verified |
| UT-005 | Posts | `create()` | Reject unauthenticated post creation | No identity | `{ title: "Blocked", body: "No auth" }` | Throw auth error | Threw `Not authenticated` | Pass | Negative auth guard |
| UT-006 | Posts | `get()` | Reject unauthenticated post listing | No identity | `{}` | Throw auth error | Threw `Not authenticated` | Pass | List auth branch covered |
| UT-007 | Posts | `getCurrentUserPosts()` | Return only current user's posts | Posts seeded for `user-1` and `user-2` | Authenticated query as `user-1` | Only posts owned by `user-1` returned | Returned 1 post with `authorId=user-1` | Pass | Current-user scope verified |
| UT-008 | Posts | `getTrending()` / `getLatest()` | Limit aggregate feeds to five items | 6 posts seeded with ascending `likeCount` | `{}` | Both queries return max 5 items | Trending returned 5 items with top `likeCount=5`; latest returned 5 items with newest title `Post 5` | Pass | Feed size cap verified |
| UT-009 | Posts | `getPostById()` | Throw when target post no longer exists | Post created then deleted | Deleted `postId` | Throw not found error | Threw `Post not found` | Pass | Negative lookup |
| UT-010 | Posts | `deletePost()` | Prevent non-author post deletion | Post owned by `user-1` | `{ postId }` as `user-2` | Throw authorization error | Threw `Not authorized to delete this post` | Pass | Ownership guard |
| UT-011 | Comments | `createComment()` | Reject unauthenticated comment creation | Valid post exists; no identity | `{ postId, content: "Blocked" }` | Throw auth error | Threw `Not authenticated` | Pass | Negative auth guard |
| UT-012 | Likes | `toggleLike()` | Reject unauthenticated like toggle | Valid post exists; no identity | `{ postId }` | Throw auth error | Threw `Not authenticated` | Pass | Like auth guard |
| UT-013 | Comments | `getComments()` | Fallback to `Unknown` when author profile is missing | Post exists; comment authored by user without profile | `{ postId }` | Return comment with fallback username | Returned `author.username=Unknown` | Pass | Missing-profile branch |
| UT-014 | Likes | `hasLiked()` | Report like state for current user and guest | Post exists; one reader toggles like once | `{ postId }` | Reader sees `true` after like; guest sees `false` | Returned `false` before like, `true` after like, guest query remained `false` | Pass | Query state verification |
| UT-015 | Views | `recordView()` | Ignore unauthenticated views | Post exists; no identity | `{ postId }` | No side effects on post counters | `viewCount` stayed `0` | Pass | Guest no-op branch |
| UT-016 | Followers | `followUsers()` | Reject unauthenticated follow attempt | No identity | `{ followerId: "user-a", followingId: "user-b" }` | Throw auth error | Threw `Not authenticated` | Pass | Follower auth guard |
| UT-017 | Followers | `unfollowUsers()` | Remove relation then reject duplicate unfollow | Existing pair seeded once | Same pair submitted twice | First call deletes relation; second call throws | First call removed pair; second threw `Follow relationship does not exist` | Pass | Success + missing-pair branch |
| UT-018 | Questions | `createQuestion()` | Accept valid correct option index | Question payload valid | `correctOption=0` | Question inserted successfully | Question persisted with `correctOption=0` | Pass | Validation success path |
| UT-019 | Questions | `createQuestion()` | Reject out-of-range correct option index | No extra setup | `options=["A","B"], correctOption=2` | Throw validation error | Threw `Invalid correct option index` | Pass | Guard clause covered |
| UT-020 | Quiz | `createQuiz()` | Reject unauthenticated quiz creation | No identity | `{ test: "PLAB" }` | Throw auth error | Threw `Not authenticated` | Pass | Quiz auth guard |
| UT-021 | Quiz | `getQuizResults()` | Throw when quiz no longer exists | Quiz row created then deleted | Deleted `quizId` | Throw not found error | Threw `Quiz not found` | Pass | Negative lookup |
| UT-022 | Diagnosis Session | `createSession()` | Reject unauthenticated diagnosis session creation | No identity | `{}` | Throw auth error | Threw `Not authenticated` | Pass | Diagnosis auth guard |
| UT-023 | Dashboard | `getQuizStats()` | Exclude incomplete quizzes and return chronological scores | Two scored quizzes and one incomplete quiz seeded | Authenticated query as `learner-1` | Only scored quizzes returned in chronological order | Returned scores `[9, 7]` | Pass | Dashboard filtering verified |
| UT-024 | Diagnosis Session | `submitAnswer()` | Reject answer submitted by another user | Session owned by `doctor-1` | `{ sessionId, answer: "Wrong user" }` as `doctor-2` | Throw access error | Threw `Session not found or access denied` | Pass | Ownership guard |
| UT-025 | Diagnosis Session | `get()` | Prevent guest diagnosis session access | Session exists for `doctor-1` | Guest query with `{ sessionId }` | Reject with `Not authenticated` | Returned full diagnosis session object including `userId` and `disease` | Fail | BUG-001 |
| UT-026 | Diagnosis Session | `get()` | Prevent cross-user diagnosis session access | Session owned by `doctor-1` | Query as `doctor-2` with `{ sessionId }` | Reject with access error | Returned another user's diagnosis session object | Fail | BUG-002 |
| UT-027 | Quiz | `finishQuiz()` | Prevent different user from finishing another user's quiz | Quiz owned by `learner-1` | Mutation as `learner-2` with `{ quizId }` | Reject with access error | Mutation resolved successfully | Fail | BUG-003 |
| UT-028 | Quiz | `getQuizResults()` | Prevent different user from reading another user's quiz results | Quiz owned by `learner-1` | Query as `learner-2` with `{ quizId }` | Reject with access error | Returned quiz summary and results array | Fail | BUG-004 |
| UT-029 | Followers | `followUsers()` | Prevent follower identity spoofing | Authenticated attacker session | `{ followerId: "victim-user", followingId: "target-user" }` as `attacker` | Reject with identity mismatch error | Mutation resolved successfully | Fail | BUG-005 |
| UT-030 | Quiz | `getQuizQuestions()` | Prevent different user from reading another user's quiz questions | Quiz owned by `learner-1` | Query as `learner-2` with `{ quizId }` | Reject with access error | Returned quiz questions array | Fail | BUG-006 |
| UT-031 | Answers | `submitAnswer()` | Prevent different user from submitting answers to another user's quiz | Quiz owned by `learner-1`; question exists | Mutation as `learner-2` with `{ quizId, questionId, selectedOption: 0 }` | Reject with access error | Mutation wrote answer row and returned `quizQuestions` id | Fail | BUG-007 |
| UT-032 | Quiz | `getQuizResults()` | Prevent guest access to quiz results | Quiz owned by `learner-1` | Guest query with `{ quizId }` | Reject with `Not authenticated` | Returned quiz summary and results array | Fail | BUG-008 |
| UT-033 | Quiz | `getQuizQuestions()` | Prevent guest access to quiz questions | Quiz owned by `learner-1` | Guest query with `{ quizId }` | Reject with `Not authenticated` | Returned quiz questions array | Fail | BUG-009 |
| UT-034 | Quiz | `finishQuiz()` | Prevent guest quiz completion | Quiz owned by `learner-1` | Guest mutation with `{ quizId }` | Reject with `Not authenticated` | Mutation resolved successfully | Fail | BUG-010 |
| UT-035 | Proxy | `default export` | Allow guests onto public route | Auth mock returns false | Request to `/` | HTTP 200 pass-through | Returned status `200` | Pass | Public route allowed |
| UT-036 | Proxy | `default export` | Redirect guests away from protected routes | Auth mock returns false | Request to `/dashboard` | 307 redirect to `/signin` | Returned `307` with `location=http://localhost/signin` | Pass | Protected route guard |
| UT-037 | Proxy | `default export` | Allow authenticated users onto protected routes | Auth mock returns true | Request to `/dashboard` | HTTP 200 pass-through | Returned status `200` | Pass | Authenticated access allowed |
| UT-038 | Proxy | `default export` | Redirect authenticated users away from auth routes | Auth mock returns true | Request to `/signin` | 307 redirect to `/dashboard` | Returned `307` with `location=http://localhost/dashboard` | Pass | Signed-in redirect |
| UT-039 | Utils | `cn()` | Merge conditional class names | Utility imported | `cn("px-2", false && "hidden", "py-4")` | Falsey class omitted | Returned `px-2 py-4` | Pass | `clsx` behavior verified |
| UT-040 | Utils | `cn()` | Resolve conflicting Tailwind classes | Utility imported | `cn("px-2", "px-4", "text-sm")` | Later conflicting class wins | Returned `px-4 text-sm` | Pass | `tailwind-merge` behavior verified |

## Integration Test

| Test ID | Modules Involved | Test Scenario | API Endpoint | Request Data | Expected Response | Database Validation | Actual Result | Pass/Fail | Defect ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| IT-001 | Posts + Profile | Created post can be fetched with enriched author details | `api.posts.create` + `api.posts.getPostById` | Auth user creates `Integrated post` | Retrieved post includes author block | `posts` row exists and profile join resolves | Retrieved post with `author.username=alice` | Pass | N/A |
| IT-002 | Posts + Likes | First like updates like state and trending list | `api.likes.toggleLike` + `api.likes.hasLiked` + `api.posts.getTrending` | `{ postId }` by `reader-1` | `hasLiked=true`; trending includes post | `likeCount` increments to `1` | Post became top trending item with `likeCount=1` | Pass | N/A |
| IT-003 | Posts + Likes | Unlike propagates back to aggregate counters | `api.likes.toggleLike` + `api.posts.getPostById` | Toggle like twice | `hasLiked=false`; counter returns to zero | `likes` relation removed and `likeCount=0` | Post detail showed `likeCount=0` after second toggle | Pass | N/A |
| IT-004 | Posts + Comments + Profile | Comment creation updates post aggregate and comment feed | `api.comments.createComment` + `api.posts.getPostById` + `api.comments.getComments` | `{ postId, content: "Integrated comment" }` | Comment visible with author metadata | `commentCount=1` on post | Post count incremented and comment returned with `author.username=mentor` | Pass | N/A |
| IT-005 | Followers | Follower relation appears in both query directions | `api.followers.followUsers` + queries | `user-a` follows `user-b` | Queries show relationship | `followers` table contains pair | Both follower and following collections returned one row | Pass | N/A |
| IT-006 | Followers | Unfollow removes relationship end-to-end | `api.followers.followUsers` + `api.followers.unfollowUsers` + `api.followers.isFollowing` | Same follower pair | `isFollowing=false` after removal | Pair deleted from `followers` | Relationship absent after unfollow | Pass | N/A |
| IT-007 | Views + Dashboard + Profile | Recorded view surfaces in recent posts dashboard | `api.views.recordView` + `api.dashboard.getRecentViewedPosts` | Viewer records one post view | Dashboard returns viewed post | `views` row created and post preserved | Dashboard returned one recent post with `authorName=alice` | Pass | N/A |
| IT-008 | Posts + Search | Search and latest feeds surface seeded authored content | `api.posts.getLatest` + `api.posts.search` | Titles contain `Cardiology` and `Neurology` | Latest feed length matches seed; search finds cardio post | Post rows exist in expected order | Search returned `Cardiology crash course` with `user=alice` | Pass | N/A |
| IT-009 | Questions + Quiz | Quiz generation pulls seeded question bank | `api.questions.createQuestion` + `api.quiz.createQuiz` + `api.quiz.getQuizQuestions` | 10 PLAB questions seeded | Quiz returns 10 questions | `quizQuestions` rows link seeded questions | Returned 10 questions for quiz | Pass | N/A |
| IT-010 | Quiz + Quiz Results | Quiz completion returns per-question correctness | `api.quiz.finishQuiz` + `api.quiz.getQuizResults` | One correct, one incorrect answer | Score and result flags match answers | `quizzes.score=1`, `completedAt` set | Returned `score=1`, first result correct, second incorrect | Pass | N/A |
| IT-011 | Quiz + Dashboard | Finished quiz appears in quiz dashboard stats | `api.quiz.finishQuiz` + `api.dashboard.getQuizStats` | Quiz with one correct answer | Dashboard score visible | Completed quiz stored with score | Stats returned one row with `score=1` | Pass | N/A |
| IT-012 | Diagnosis Session + Dashboard | Correct diagnosis answer counted as success | `api.diagnosisSession.createSession` + `submitAnswer` + `api.dashboard.getDiagnosisStats` | Answer equals disease | Dashboard `isCorrect=true` | `userAnswer` stored in session | Diagnosis stats returned one success row | Pass | N/A |
| IT-013 | Diagnosis Session + Dashboard | Incorrect diagnosis answer counted as failure | Same as above | Answer `Influenza` | Dashboard `isCorrect=false` | Session persisted with wrong answer | Diagnosis stats returned one failure row | Pass | N/A |
| IT-014 | Quiz + Dashboard | User-specific quiz data stays isolated | `api.quiz.createQuiz` + `finishQuiz` + `api.dashboard.getQuizStats` | Quizzes for `learner-1` only | Other user sees no stats | Only owning user rows returned by index | `learner-1` saw one stat; `learner-2` saw zero | Pass | N/A |
| IT-015 | Posts + Views + Quiz + Diagnosis + Dashboard | Cross-feature activity coexists without regression | View post, finish quiz, finish diagnosis | Mixed activity for one user | All dashboard sections populate | View, quiz, and diagnosis rows all present | Recent posts, quiz stats, and diagnosis stats each returned one record | Pass | N/A |

## System Test

| Test ID | Test Scenario | User Story / Req ID | Preconditions | Test Steps | Test Data | Expected Result | Actual Result | Environment | Pass/Fail | Severity (if fail) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ST-001 | Home page renders primary marketing content | Public landing experience | App running locally | `1. Open / 2. Verify hero text 3. Verify CTA visible` | N/A | Landing page content visible | Hero text `A platform for Medical Students` and CTA rendered | Windows 11, Chromium (Playwright), desktop | Pass | N/A |
| ST-002 | Sign-up route is reachable for guest users | Guest account creation access | App running locally | `1. Open /signup 2. Verify button visible` | N/A | Guest can reach sign-up page | URL remained `/signup`; `Sign Up` button visible | Windows 11, Chromium (Playwright), desktop | Pass | N/A |
| ST-003 | Demo navigation updates landing-page hash | Public in-page navigation | Home page reachable | `1. Open / 2. Click Demo` | N/A | URL hash changes to `#demo-video` | URL updated to `/#demo-video` | Windows 11, Chromium (Playwright), desktop | Pass | N/A |
| ST-004 | Features navigation updates landing-page hash | Public in-page navigation | Home page reachable | `1. Open / 2. Click Features` | N/A | URL hash changes to `#features` | URL updated to `/#features` | Windows 11, Chromium (Playwright), desktop | Pass | N/A |
| ST-005 | Sign-up page renders account creation controls | Guest registration form | Sign-up page reachable | `1. Open /signup 2. Verify name/email/password/button` | N/A | Primary registration inputs visible | All core controls rendered | Windows 11, Chromium (Playwright), desktop | Pass | N/A |
| ST-006 | Sign-in page renders authentication controls | Guest sign-in form | Sign-in page reachable | `1. Open /signin 2. Verify email/password/sign-in/google button` | N/A | Primary auth controls visible | Email field, password field, `Sign In`, and `Sign In with Google` visible | Windows 11, Chromium (Playwright), desktop | Pass | N/A |
| ST-007 | Guest is redirected away from dashboard | Protected route guard | No authenticated session | `1. Open /dashboard 2. Observe redirect` | N/A | Redirect to sign-in | Browser redirected to `/signin` | Windows 11, Chromium (Playwright), desktop | Pass | N/A |
| ST-008 | Guest is redirected away from practice questions | Protected route guard | No authenticated session | `1. Open /practice-questions 2. Observe redirect` | N/A | Redirect to sign-in | Browser redirected to `/signin` | Windows 11, Chromium (Playwright), desktop | Pass | N/A |
| ST-009 | Guest is redirected away from onboarding | Protected route guard | No authenticated session | `1. Open /onboarding 2. Observe redirect` | N/A | Redirect to sign-in | Browser redirected to `/signin` | Windows 11, Chromium (Playwright), desktop | Pass | N/A |
| ST-010 | Unauthenticated chat API access is rejected | API boundary security | No authenticated session | `1. POST /api/chat 2. Inspect status/body` | `{ "sessionId": "fake-session", "messages": [] }` | HTTP 401 Unauthorized | Returned `401` with body `Unauthorized` | Windows 11, Chromium request client | Pass | N/A |

## Performance and Load Test

| Field | Value |
| --- | --- |
| Tool | k6 v1.7.1 |
| Script | [tests/performance/public-pages.js](/D:/code/Web%20Dev/synapse/tests/performance/public-pages.js) |
| Dashboard Report | [reports/k6-dashboard.html](/D:/code/Web%20Dev/synapse/reports/k6-dashboard.html) |
| Raw Summary | [reports/k6-summary.json](/D:/code/Web%20Dev/synapse/reports/k6-summary.json) |
| Scenario | Ramp to 10 VUs for 20s, then 25 VUs for 40s, then ramp down over 20s |
| Total Requests | 195 |
| Iterations | 65 |
| HTTP Failure Rate | 0.00% |
| Avg Response Time | 18.87s |
| p90 Response Time | 28.28s |
| p95 Response Time | 29.63s |
| Threshold Result | Failed |
| Threshold Details | `http_req_failed < 5%` passed; `http_req_duration p(95) < 1000ms` failed |
| Checks | `status is 200 or redirect`: 195 pass / 0 fail; `responds within 1s`: 0 pass / 195 fail |
| Notes | The app stayed available under load, but latency was far above the 1s target during the dev-server run. |
