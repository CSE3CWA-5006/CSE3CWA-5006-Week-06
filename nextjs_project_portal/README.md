# Next.js Project Portal

This teaching project closes the React and Node.js section of the subject.

It shows how Next.js can organise a React application into a full-stack project:

- `app/page.jsx` renders the main page as a Server Component.
- `components/ProjectForm.jsx` is a Client Component because it handles interactive form state.
- `app/actions.js` contains a Server Action for form submission.
- `app/api/projects/route.js` exposes a JSON API that can be tested with Postman or curl.
- `lib/projects.js` reads and writes local JSON data for classroom practice.

## Run on Ubuntu

```bash
chmod +x run_ubuntu.sh
./run_ubuntu.sh
```

Then open:

```text
http://localhost:3000
```

## Important teaching note

This demo stores data in a local JSON file so the full-stack flow is easy to inspect.
That is suitable for local learning. A production project should use a real database
such as PostgreSQL, MongoDB, or another managed data service.
