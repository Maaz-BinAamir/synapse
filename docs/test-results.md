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

Latest unit-test verification: `npm run test:unit` completed successfully with 6 test files passed and 49 test cases passed.

| Test ID | Module Name | Function Name | Test Description | Preconditions | Input / Test Data | Expected Output | Actual Output | Pass/Fail | Remarks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UT-001 | Posts | `create()` | Create post for authenticated user | Identity present | `{ title: "First post", body: "Hello world" }` | Post inserted with zeroed counters | Post persisted with `authorId=user-1`, `commentCount=0`, `likeCount=0`, `viewCount=0` | Pass | Executed with `convex-test` identity |
| UT-002 | Posts | `create()` | Reject guest post creation | No identity | `{ title: "Blocked", body: "No auth" }` | Throw auth error | Threw `Not authenticated` | Pass | Negative auth guard |
| UT-003 | Posts | `get()` | Return posts with usernames | Profiles and posts seeded | Authenticated viewer query | Posts ordered desc with username projection | Returned 2 posts, newest first, usernames `bob` then `alice` | Pass | Covers profile enrichment |
| UT-004 | Posts | `get()` | Reject guest post listing | No identity | `{}` | Throw auth error | Threw `Not authenticated` | Pass | Auth branch covered |
| UT-005 | Posts | `getPostById()` | Fetch enriched post by id | Profile exists | `postId` for authored post | Post plus author profile | Returned post with `images=null` and `author.username=alice` | Pass | Covers detail query |
| UT-006 | Posts | `getPostById()` | Missing post handling | Post deleted before fetch | Deleted `postId` | Throw not found error | Threw `Post not found` | Pass | Negative lookup |
| UT-007 | Posts | `getPostsByAuthor()` | Filter author posts in descending order | Multiple posts across authors | `authorId=user-1` | Only current author posts returned desc | Returned IDs `[second, first]` | Pass | Index ordering verified |
| UT-008 | Posts | `getCurrentUserPosts()` | Return only current user posts | Mixed authored posts | Authenticated `user-1` | One post owned by current user | Returned 1 post with `authorId=user-1` | Pass | Current-user scope verified |
| UT-009 | Posts | `getTrending()` / `getLatest()` | Limit results to five | 6 posts seeded | `{}` | Max 5 items in each query | Trending returned 5 items with top `likeCount=5`; latest returned 5 items with newest title `Post 5` | Pass | Aggregate list behavior |
| UT-010 | Posts | `search()` | Search titles and project usernames | Profiles and titles seeded | `{ query: "Cardio" }` | Matching post returned | Returned 1 post titled `Cardiology pearls` with `user=alice` | Pass | Search index verified |
| UT-011 | Posts | `deletePost()` | Allow author deletion | Authenticated author | `{ postId }` | Return true and remove post | Returned `true`; DB lookup became `null` | Pass | Delete success path |
| UT-012 | Posts | `deletePost()` | Prevent non-author deletion | Post owned by another user | `{ postId }` as `user-2` | Throw authorization error | Threw `Not authorized to delete this post` | Pass | Ownership guard |
| UT-013 | Comments | `createComment()` | Create comment and increment count | Valid post and identity | `{ postId, content: "Helpful reply" }` | Comment inserted and post count incremented | Comment persisted and `commentCount` changed to `1` | Pass | Cross-table mutation branch |
| UT-014 | Comments | `createComment()` | Reject guest comment creation | No identity | `{ postId, content: "Blocked" }` | Throw auth error | Threw `Not authenticated` | Pass | Negative auth guard |
| UT-015 | Comments | `getComments()` | Return author metadata with comments | Author profile exists | `{ postId }` | Comment includes username/avatar | Returned author block with `username=dr-alice`, `avatar=null` | Pass | Enrichment path |
| UT-016 | Comments | `getComments()` | Fallback author label | No profile for author | `{ postId }` | `Unknown` username fallback | Returned `author.username=Unknown` | Pass | Missing-profile branch |
| UT-017 | Likes | `toggleLike()` | First toggle creates like | Authenticated user and post | `{ postId }` | Return `true`; increment like count | Returned `true`; `likeCount=1` | Pass | Like creation path |
| UT-018 | Likes | `toggleLike()` | Second toggle removes like | Existing like present | `{ postId }` | Return `false`; decrement like count | Returned `false`; `likeCount=0` | Pass | Unlike branch |
| UT-019 | Likes | `toggleLike()` | Reject guest like attempt | No identity | `{ postId }` | Throw auth error | Threw `Not authenticated` | Pass | Negative auth guard |
| UT-020 | Likes | `hasLiked()` | Report like status for user and guest | Post liked once by reader | `{ postId }` | Reader true, guest false | Returned `false` before like, `true` after like, guest query remained `false` | Pass | Query state verification |
| UT-021 | Views | `recordView()` | Record only one view per user | Post exists and user authenticated | Repeated `{ postId }` | Single view row and `viewCount=1` | Persisted 1 `views` row and `viewCount=1` after two calls | Pass | Duplicate protection |
| UT-022 | Views | `recordView()` | Ignore guest views | No identity | `{ postId }` | No side effects | `viewCount` stayed `0` | Pass | Guest no-op branch |
| UT-023 | Followers | `followUsers()` / `getFollowers()` / `getFollowing()` / `isFollowing()` | Create and resolve relationship | Authenticated follower | `followerId=user-a`, `followingId=user-b` | Relationship visible in all follower queries | `isFollowing=true`; both follower/following collections length `1` | Pass | Multi-query relationship coverage |
| UT-024 | Followers | `followUsers()` | Reject guest follow attempt | No identity | `followerId=user-a`, `followingId=user-b` | Throw auth error | Threw `Not authenticated` | Pass | Negative auth guard |
| UT-025 | Followers | `unfollowUsers()` | Remove relationship and reject duplicate removal | Existing relationship seeded | Same pair twice | First call deletes; second call errors | First call removed relation; second threw `Follow relationship does not exist` | Pass | Success + missing relation branch |
| UT-026 | Questions | `createQuestion()` | Accept valid answer index | Question payload valid | `correctOption=0` | Question inserted | Question persisted with `correctOption=0` | Pass | Validation success path |
| UT-027 | Questions | `createQuestion()` | Reject out-of-range answer index | No extra setup | `options=["A","B"], correctOption=2` | Throw validation error | Threw `Invalid correct option index` | Pass | Guard clause covered |
| UT-028 | Quiz | `createQuiz()` | Cap generated quiz to 10 questions | 12 questions seeded | `{ test: "PLAB" }` | Exactly 10 quiz questions linked | Created quiz with 10 `quizQuestions` rows | Pass | Selection cap verified |
| UT-029 | Quiz | `createQuiz()` | Reject guest quiz creation | No identity | `{ test: "PLAB" }` | Throw auth error | Threw `Not authenticated` | Pass | Negative auth guard |
| UT-030 | Quiz | `getQuizQuestions()` | Return questions linked to a quiz | 2 PLAB questions seeded and quiz created | `{ quizId }` | 2 quiz question records returned | Returned 2 questions | Pass | Quiz-question relation verified |
| UT-031 | Quiz | `finishQuiz()` / `getQuizResults()` | Score selected answers | 2 questions seeded; one selected correctly and one incorrectly | `{ quizId }` with selected options `[0, 0]` | Quiz score is 1 and two result rows are returned | Returned `score=1` and 2 result entries | Pass | Result calculation verified |
| UT-032 | Quiz | `getQuizResults()` | Missing quiz handling | Quiz row created then deleted | Deleted `quizId` | Throw not found error | Threw `Quiz not found` | Pass | Negative lookup |
| UT-033 | Diagnosis Session | `createSession()` | Create diagnosis session for authenticated user | Identity present | `{}` with `subject=doctor-1` | Session stored for current user with disease | Created session with `userId=doctor-1` and non-empty disease | Pass | Random disease selection mocked |
| UT-034 | Diagnosis Session | `createSession()` | Reject guest diagnosis session creation | No identity | `{}` | Throw auth error | Threw `Not authenticated` | Pass | Negative auth guard |
| UT-035 | Diagnosis Session | `submitAnswer()` | Submit owner answer and return correct answer | Session owned by `doctor-1` | `{ sessionId, answer: "Sorethroat/Respiratory tract infections" }` | Return correct answer and persist submitted answer | Returned session disease as `correctAnswer`; saved `userAnswer` | Pass | Owner write path verified |
| UT-036 | Diagnosis Session | `submitAnswer()` | Reject answer submitted by different user | Session owned by `doctor-1`; request from `doctor-2` | `{ sessionId, answer: "Wrong user" }` | Throw access error | Threw `Session not found or access denied` | Pass | Ownership guard |
| UT-037 | Dashboard | `getQuizStats()` | Return only completed quiz scores in chronological order | Two scored quizzes and one incomplete quiz seeded | Authenticated `learner-1` query | Incomplete quiz excluded; scores returned in insertion order | Returned scores `[9, 7]` | Pass | Dashboard quiz aggregation |
| UT-038 | Dashboard | `getDiagnosisStats()` | Normalize diagnosis correctness checks | One matching answer with whitespace/case difference and one wrong answer seeded | Authenticated `doctor-1` query | Correctness flags `[true, false]` | Returned `isCorrect` values `[true, false]` | Pass | Case/trim normalization verified |
| UT-039 | Dashboard | `getRecentViewedPosts()` | Return recent viewed posts with author names and skip deleted posts | Profile, visible post, deleted viewed post, and view rows seeded | Authenticated `viewer-1` query | Only existing viewed post returned with author display name | Returned 1 post titled `Viewed post` with `authorName=mentor` | Pass | Missing-post filter verified |
| UT-040 | Chat API Route | `POST()` | Reject unauthenticated chat requests | Auth mock returns false | `{ sessionId: "session-1", messages: [] }` | HTTP 401 | Returned `401 Unauthorized` | Pass | External auth mocked |
| UT-041 | Chat API Route | `POST()` | Reject invalid chat payload | Authenticated request with missing `sessionId` | `{ messages: [] }` | HTTP 400 | Returned `400 Invalid request payload` | Pass | Request validation branch |
| UT-042 | Chat API Route | `POST()` | Reject chat for missing diagnosis session | Authenticated request; Convex session query returns `null` | `{ sessionId: "session-1", messages: [{ id: "1", role: "user", parts: [] }] }` | HTTP 404 | Returned `404 Diagnosis session not found` | Pass | Session existence guard |
| UT-043 | Chat API Route | `POST()` | Stream AI response for valid chat request | Authenticated request; diagnosis session disease exists | `{ sessionId: "session-1", messages: [...] }` | Stream response returned; model and system prompt configured | Returned mocked stream response; system prompt contained `Malaria` | Pass | Groq and AI SDK mocked |
| UT-044 | Proxy | `default export` | Allow guest access to public route | Auth mock returns false | Request to `/` | Continue with HTTP 200 | Returned status `200` | Pass | Public route allowed |
| UT-045 | Proxy | `default export` | Redirect guests from protected routes | Auth mock returns false | Request to `/dashboard` | 307 redirect to `/signin` | Returned status `307` with `location=http://localhost/signin` | Pass | Middleware/proxy behavior mocked |
| UT-046 | Proxy | `default export` | Allow authenticated users on protected routes | Auth mock returns true | Request to `/dashboard` | Continue with HTTP 200 | Returned status `200` | Pass | Authenticated protected-route access |
| UT-047 | Proxy | `default export` | Redirect authenticated users away from auth routes | Auth mock returns true | Request to `/signin` | 307 redirect to `/dashboard` | Returned status `307` with `location=http://localhost/dashboard` | Pass | Prevents signed-in users from auth pages |
| UT-048 | Utils | `cn()` | Merge conditional class names | Utility imported | `cn("px-2", false && "hidden", "py-4")` | Falsey class omitted | Returned `px-2 py-4` | Pass | `clsx` behavior verified |
| UT-049 | Utils | `cn()` | Resolve conflicting Tailwind classes | Utility imported | `cn("px-2", "px-4", "text-sm")` | Later conflicting padding class wins | Returned `px-4 text-sm` | Pass | `tailwind-merge` behavior verified |

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
