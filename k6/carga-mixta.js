import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:8000";

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 30 },
    { duration: "1m", target: 60 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.10"],
    http_req_duration: ["p(95)<2000"],
  },
};

export default function () {
  if (Math.random() < 0.8) {
    const res = http.get(`${BASE_URL}/api/turnos?limit=50`);
    check(res, { "GET status 200": (r) => r.status === 200 });
  } else {
    const payload = JSON.stringify({
      mascota: `Mixto-${__VU}-${__ITER}`,
      duenio: `Operador-${__VU}`,
      fecha: "2026-05-23",
      hora: `${String(9 + (__ITER % 8)).padStart(2, "0")}:30`,
      motivo: "Turno creado por carga mixta",
    });

    const res = http.post(`${BASE_URL}/api/turnos`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    check(res, { "POST status 201": (r) => r.status === 201 });
  }

  sleep(0.5);
}
