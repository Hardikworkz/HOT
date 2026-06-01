const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * PostgREST sometimes returns transient "schema cache" errors after DDL changes.
 * Retry a few times with backoff before surfacing the error.
 */
function isSchemaOrTransientPostgrestError(err) {
  if (!err || !err.message) return false;
  const msg = String(err.message).toLowerCase();
  return (
    msg.includes('schema cache') ||
    msg.includes('pgrst') ||
    msg.includes('connection reset') ||
    msg.includes('econnreset')
  );
}

/** @param {() => Promise<{ data: unknown; error: { message?: string } | null }>} run */
async function withPostgrestRetry(run, { maxAttempts = 3, baseDelayMs = 350 } = {}) {
  let last = await run();
  if (!last.error) return last;

  for (let attempt = 1; attempt < maxAttempts && last.error; attempt += 1) {
    if (!isSchemaOrTransientPostgrestError(last.error)) break;
    await sleep(baseDelayMs * attempt);
    last = await run();
    if (!last.error) return last;
  }

  return last;
}

module.exports = { withPostgrestRetry, isSchemaOrTransientPostgrestError };
