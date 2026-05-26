import http from "k6/http";
import { check, sleep } from "k6";
import { Counter } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "http://localhost:8000";
const appRequestsByReplica = new Counter("firulais_app_requests_by_replica");

export const options = {
  noConnectionReuse: true,
  stages: [
    { duration: "20s", target: 20 },
    { duration: "40s", target: 60 },
    { duration: "40s", target: 100 },
    { duration: "20s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.20"],
  },
};

export function setup() {
  for (let i = 0; i < 300; i += 1) {
    const payload = JSON.stringify({
      mascota: `Stress-${i}`,
      duenio: `Carga-${i % 30}`,
      fecha: "2026-05-24",
      hora: `${String(8 + (i % 10)).padStart(2, "0")}:15`,
      motivo: "Datos preparados para prueba de stress",
    });

    http.post(`${BASE_URL}/api/turnos`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  }
}

function recordReplica(res, method) {
  const replica =
    res.headers["X-Firulais-Replica"] ||
    res.headers["x-firulais-replica"] ||
    "sin-replica";

  appRequestsByReplica.add(1, {
    replica,
    method,
    status: String(res.status),
  });
}

export default function () {
  if (Math.random() < 0.9) {
    const res = http.get(`${BASE_URL}/api/turnos?limit=50`);
    recordReplica(res, "GET");
    check(res, { "GET status 200": (r) => r.status === 200 });
  } else {
    const payload = JSON.stringify({
      mascota: `Stress-${__VU}-${__ITER}`,
      duenio: `Alumno-${__VU}`,
      fecha: "2026-05-24",
      hora: `${String(8 + (__ITER % 10)).padStart(2, "0")}:45`,
      motivo: "Escritura durante prueba de stress",
    });

    const res = http.post(`${BASE_URL}/api/turnos`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    recordReplica(res, "POST");
    check(res, { "POST status 201": (r) => r.status === 201 });
  }

  sleep(0.05);
}
