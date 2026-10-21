# API foundation

Hono on Workers. Only `/health` exists. No D1 resource, auth, upload, household
or settlement route is provisioned or implemented. Run from the repository root:

```sh
npm ci
npm run dev:api
npm run typecheck
npm test
npm run build --workspace @netscope/api
```

Build uses Wrangler dry-run and does not deploy. Do not run a real deploy until
S01 provisions reviewed free-tier resources. Add D1/Drizzle/Better Auth with their
issues, migrations and security tests rather than installing unused dependencies.
