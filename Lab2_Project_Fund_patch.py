from pathlib import Path
import os
import subprocess

ROOT = Path.cwd()

# 0) Change the database BEFORE changing application code.
#    This prevents Next.js hot-reload from seeing p.fund before the column exists.
env = os.environ.copy()
env['PGPASSWORD'] = env.get('POSTGRES_PASSWORD', 'week6')
result = subprocess.run([
    'psql',
    '-h', env.get('POSTGRES_HOST', 'localhost'),
    '-U', env.get('POSTGRES_USER', 'week6'),
    '-d', env.get('POSTGRES_DB', 'week6_portal'),
    '-v', 'ON_ERROR_STOP=1',
    '-c', 'ALTER TABLE projects ADD COLUMN IF NOT EXISTS fund INTEGER NOT NULL DEFAULT 0 CHECK (fund >= 0);'
], cwd=ROOT, env=env, text=True)
if result.returncode != 0:
    raise SystemExit('ERROR: PostgreSQL migration failed. No application files were changed.')
print('PASS database migration: projects.fund')


def replace(path, old, new, label, expected=1):
    p = ROOT / path
    if not p.exists():
        raise SystemExit(f'ERROR: missing file {path}.')
    text = p.read_text(encoding='utf-8')
    count = text.count(old)
    if count != expected:
        raise SystemExit(
            f'ERROR: {label} expected {expected} match(es), found {count} in {path}. '
            'Stop without applying this replacement.'
        )
    p.write_text(text.replace(old, new, expected), encoding='utf-8')
    print(f'PASS {label}')

# 1) Database schema file: db/schema.sql
replace(
    'db/schema.sql',
    """  summary TEXT NOT NULL DEFAULT '',
  due_date DATE,""",
    """  summary TEXT NOT NULL DEFAULT '',
  fund INTEGER NOT NULL DEFAULT 0 CHECK (fund >= 0),
  due_date DATE,""",
    '1/6 db/schema.sql'
)

# 2) Zod schema file: lib/schemas/projects.js
replace(
    'lib/schemas/projects.js',
    '''  summary: z.string().trim().max(500).default(""),
  dueDate: optionalDate''',
    '''  summary: z.string().trim().max(500).default(""),
  fund: z.coerce.number().int().min(0).default(0),
  dueDate: optionalDate''',
    '2/6 lib/schemas/projects.js'
)

# 3) Repository file: lib/repositories/projects.repository.js
replace(
    'lib/repositories/projects.repository.js',
    '''    p.progress,
    p.summary,
    p.due_date AS "dueDate",''',
    '''    p.progress,
    p.summary,
    p.fund,
    p.due_date AS "dueDate",''',
    '3/6 repository SELECT',
    expected=1
)

replace(
    'lib/repositories/projects.repository.js',
    '''    `INSERT INTO projects
      (name, owner, status, category, priority, progress, summary, due_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING
       id, name, owner, status, category, priority, progress, summary,
       due_date AS "dueDate", created_at AS "createdAt", updated_at AS "updatedAt"`,''',
    '''    `INSERT INTO projects
      (name, owner, status, category, priority, progress, fund, summary, due_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING
       id, name, owner, status, category, priority, progress, fund, summary,
       due_date AS "dueDate", created_at AS "createdAt", updated_at AS "updatedAt"`,''',
    '3/6 repository INSERT SQL'
)

replace(
    'lib/repositories/projects.repository.js',
    '''      input.priority,
      input.progress,
      input.summary,
      input.dueDate''',
    '''      input.priority,
      input.progress,
      input.fund,
      input.summary,
      input.dueDate''',
    '3/6 repository INSERT values'
)

replace(
    'lib/repositories/projects.repository.js',
    '''    progress: "progress",
    summary: "summary",
    dueDate: "due_date"''',
    '''    progress: "progress",
    fund: "fund",
    summary: "summary",
    dueDate: "due_date"''',
    '3/6 repository UPDATE mapping'
)

replace(
    'lib/repositories/projects.repository.js',
    '''     RETURNING
       id, name, owner, status, category, priority, progress, summary,
       due_date AS "dueDate", created_at AS "createdAt", updated_at AS "updatedAt"`,''',
    '''     RETURNING
       id, name, owner, status, category, priority, progress, fund, summary,
       due_date AS "dueDate", created_at AS "createdAt", updated_at AS "updatedAt"`,''',
    '3/6 repository UPDATE RETURNING'
)

# Snapshot SELECT is a separate query from projectSelect. It has the same visible
# columns, so update its second occurrence explicitly after projectSelect changed.
p = ROOT / 'lib/repositories/projects.repository.js'
text = p.read_text(encoding='utf-8')
needle = '''      SELECT
        p.id,
        p.name,
        p.owner,
        p.status,
        p.category,
        p.priority,
        p.progress,
        p.summary,
        p.due_date AS "dueDate",'''
replacement = '''      SELECT
        p.id,
        p.name,
        p.owner,
        p.status,
        p.category,
        p.priority,
        p.progress,
        p.summary,
        p.fund,
        p.due_date AS "dueDate",'''
count = text.count(needle)
if count != 1:
    raise SystemExit(f'ERROR: 3/6 repository snapshot expected 1 match, found {count}.')
p.write_text(text.replace(needle, replacement, 1), encoding='utf-8')
print('PASS 3/6 repository snapshot')

# 4) Server Action file: app/actions.js
old_action = '''      progress: value(formData, "progress"),
      summary: value(formData, "summary"),
      dueDate: value(formData, "dueDate")'''
new_action = '''      progress: value(formData, "progress"),
      fund: value(formData, "fund"),
      summary: value(formData, "summary"),
      dueDate: value(formData, "dueDate")'''
replace('app/actions.js', old_action, new_action, '4/6 app/actions.js Create/Edit', expected=2)

# 5) Shared Create/Edit form: components/ProjectFormModal.jsx
replace(
    'components/ProjectFormModal.jsx',
    '''                <div className="form-grid two">
                  <Field label="Progress (%)">
                    <input name="progress" type="number" min="0" max="100" defaultValue={project?.progress ?? 0} />
                  </Field>
                  <Field label="Due date">
                    <input name="dueDate" type="date" defaultValue={project?.dueDate ? String(project.dueDate).slice(0, 10) : ""} />
                  </Field>
                </div>''',
    '''                <div className="form-grid three">
                  <Field label="Progress (%)">
                    <input name="progress" type="number" min="0" max="100" defaultValue={project?.progress ?? 0} />
                  </Field>
                  <Field label="Project Fund ($)">
                    <input name="fund" type="number" min="0" step="1" defaultValue={project?.fund ?? 0} placeholder="e.g. 25000" />
                  </Field>
                  <Field label="Due date">
                    <input name="dueDate" type="date" defaultValue={project?.dueDate ? String(project.dueDate).slice(0, 10) : ""} />
                  </Field>
                </div>''',
    '5/6 components/ProjectFormModal.jsx'
)

# 6) Project card: components/ProjectCard.jsx
replace(
    'components/ProjectCard.jsx',
    '''        <span className="card-meta">
          <span>{labelFor(project.priority)} priority</span>
          <span>{formatDate(project.dueDate)}</span>
        </span>''',
    '''        <span className="card-meta">
          <span>{labelFor(project.priority)} priority</span>
          <span>Fund ${Number(project.fund ?? 0).toLocaleString("en-AU")}</span>
          <span>{formatDate(project.dueDate)}</span>
        </span>''',
    '6/6 components/ProjectCard.jsx'
)

print('Project Fund patch complete.')
