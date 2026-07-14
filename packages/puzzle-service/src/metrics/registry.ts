import client from "prom-client";

/**
 * Central Prometheus registry for the service, per ADR-007/ADR-008.
 * All metrics below are registered here and exposed via GET /metrics.
 */
export const metricsRegistry = new client.Registry();
client.collectDefaultMetrics({ register: metricsRegistry });

export const httpRequestDuration = new client.Histogram({
  name: "puzzle_service_http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [metricsRegistry],
});

export const httpErrorsCounter = new client.Counter({
  name: "puzzle_service_http_errors_total",
  help: "Total number of HTTP responses with a 4xx or 5xx status, labeled by method, route, and status",
  labelNames: ["method", "route", "status"] as const,
  registers: [metricsRegistry],
});

export const puzzlesGeneratedCounter = new client.Counter({
  name: "puzzle_service_puzzles_generated_total",
  help: "Total number of puzzles generated, labeled by difficulty",
  labelNames: ["difficulty"] as const,
  registers: [metricsRegistry],
});

export const validationsCounter = new client.Counter({
  name: "puzzle_service_validations_total",
  help: "Total number of board validations performed, labeled by outcome",
  labelNames: ["result"] as const,
  registers: [metricsRegistry],
});
