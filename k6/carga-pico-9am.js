import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:8000";

export const options = {
  stages: [
    { duration: "1m", target: 20 },
    { duration: "1m", target: 80 },
    { duration: "2m", target: 150 },
    { duration: "1m", target: 150 },
    { duration: "1m", target: 20 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.10"],
    http_req_duration: ["p(95)<2000"],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/api/turnos?limit=50`);
  check(res, {
    "status 200": (r) => r.status === 200,
  });
  sleep(1);
}
