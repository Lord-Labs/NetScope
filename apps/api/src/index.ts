import { Hono } from 'hono';

const app = new Hono();

app.get('/health', (context) =>
  context.json({
    status: 'ok',
    service: 'netscope-api',
    version: '0.0.0',
    capabilities: { measurement_ingest: false, authentication: false },
  }),
);

app.notFound((context) => context.json({ error: 'not_found' }, 404));
app.onError((error, context) => {
  console.error('request_failed', error.name);
  return context.json({ error: 'internal_error' }, 500);
});

export default app;
