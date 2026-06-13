# Loads Supabase MCP credentials from .env.local and starts the server.
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $projectRoot ".env.local"

if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith("#")) { return }
    $eq = $line.IndexOf("=")
    if ($eq -lt 1) { return }
    $key = $line.Substring(0, $eq).Trim()
    $value = $line.Substring($eq + 1).Trim()
    if ($key -and $value) {
      Set-Item -Path "Env:$key" -Value $value
    }
  }
}

if (-not $env:SUPABASE_ACCESS_TOKEN) {
  Write-Error "SUPABASE_ACCESS_TOKEN is missing. Add it to .env.local (see .env.local.example)."
  exit 1
}

$projectRef = "dxjgbiucqfhhymjfpzsq"
$npx = (Get-Command npx -ErrorAction SilentlyContinue).Source

if (-not $npx) {
  Write-Error "npx not found. Install Node.js and restart Cursor."
  exit 1
}

& $npx "-y" "@supabase/mcp-server-supabase@latest" "--project-ref=$projectRef"
