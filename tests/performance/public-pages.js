import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "20s", target: 10 },
    { duration: "40s", target: 25 },
    { duration: "20s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<1000"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://127.0.0.1:3000";

/* eslint import/no-anonymous-default-export: [2, {"allowAnonymousFunction": true}] */
export default function () {
  const responses = http.batch([
    ["GET", `${BASE_URL}/`],
    ["GET", `${BASE_URL}/signin`],
    ["GET", `${BASE_URL}/signup`],
  ]);

  responses.forEach((response) => {
    check(response, {
      "status is 200 or redirect": (res) =>
        res.status === 200 || res.status === 307 || res.status === 308,
      "responds within 1s": (res) => res.timings.duration < 1000,
    });
  });

  sleep(1);
}
