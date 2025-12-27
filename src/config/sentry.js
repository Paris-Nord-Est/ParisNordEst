/**
 * Sentry Configuration
 * 
 * Note: The DSN is safe to include in public/client-side code.
 * Sentry DSNs are designed to be public - they're endpoint URLs, not secrets.
 * Access is controlled via Sentry project settings, rate limiting, and CORS.
 */

const SENTRY_DSN = "https://786378f93b10a8caabb01fad370794ed@o4510608867917824.ingest.de.sentry.io/4510608879452240";

export const sentryConfig = {
  dsn: SENTRY_DSN,
  environment: "production",
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
};

