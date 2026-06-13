# Supabase MCP (Cursor)

This project includes the official Supabase MCP server so the AI can run migrations, execute SQL, and manage your database directly.

## One-time setup

### 1. Create a Supabase Personal Access Token (PAT)

1. Open [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)
2. Click **Generate new token**
3. Name it something like `cursor-mcp`
4. Copy the token (starts with `sbp_`)

### 2. Add it to `.env.local`

```env
SUPABASE_ACCESS_TOKEN=sbp_your_token_here
```

Your existing Supabase URL and anon key can stay in the same file.

### 3. Restart Cursor

MCP servers load at startup. Fully quit Cursor and reopen it.

### 4. Enable the server

1. Open **Cursor Settings → Tools & MCP** (or **Features → MCP**)
2. Find **supabase** in the list
3. Make sure it is **enabled** (green / toggled on)

## Verify it works

In Agent chat, ask something like:

> List my Supabase tables

You should see MCP tools being used (`list_tables`, `apply_migration`, etc.).

## What the AI can do

With MCP connected (write mode, project-scoped to `dxjgbiucqfhhymjfpzsq`):

- Apply migrations from `supabase/migrations/`
- Run SQL and inspect schema
- Manage storage, edge functions, and more

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Red error in MCP panel | Check `SUPABASE_ACCESS_TOKEN` in `.env.local` |
| `npx not found` | Restart Cursor after installing Node.js |
| Server not listed | Open the `my-app` folder (not parent `coding stuff`) |
| Token unauthorized | Generate a new PAT; old ones expire if revoked |

## Security

- Never commit `.env.local` or your PAT to git
- The MCP is scoped to this project only (`dxjgbiucqfhhymjfpzsq`)
- Write access is enabled so migrations can be applied — do not use production credentials casually
