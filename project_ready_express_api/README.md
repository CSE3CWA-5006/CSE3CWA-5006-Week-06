# Project-Ready Express API

This teaching demo shows how an Express API can be organised beyond a single `index.js` file.

It demonstrates:

- route modules
- controllers
- services
- repositories
- validation with Zod
- central error handling
- authentication middleware
- pagination, filtering and sorting
- consistent JSON responses

## Run on Ubuntu

```bash
cd project_ready_express_api
chmod +x run_ubuntu.sh
./run_ubuntu.sh
```

Open `http://localhost:4000/api/health`.

Protected write routes require:

```text
x-api-key: week6-demo-key
```
