# ======= Load Token from .github-token.env.txt =======
$envFile = ".\.github-token.env.txt"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^\s*GITHUB_TOKEN\s*=\s*(.+)\s*$") {
            $token = $matches[1]
        }
    }
}
else {
    Write-Output "❗️ Token file not found. Please create .github-token.env.txt"
    exit
}

if (-not $token) {
    Write-Output "❗️ GitHub Token not found in token file."
    exit
}

# ======= Configuration =======
$repoOwner = "dtwincode"
$repoName = "dtwin-supply-optimizer-32"
$apiUrl = "https://api.github.com/repos/$repoOwner/$repoName/contents"

$headers = @{
    Authorization = "token $token"
    Accept        = "application/vnd.github.v3+json"
}

# ======= Make API Call =======
try {
    $response = Invoke-RestMethod -Uri $apiUrl -Headers $headers
}
catch {
    Write-Output "`n❗️ Error fetching data: $($_.Exception.Message)"
    exit
}

# ======= Print Result =======
Write-Output "`nRepository Content:"
$response | ForEach-Object {
    Write-Output "$($_.name)  (Type: $($_.type))"
}

# ======= Save to JSON =======
$outputPath = ".\repo-content-output.json"
$response | ConvertTo-Json -Depth 10 | Out-File -FilePath $outputPath -Encoding utf8

Write-Output "`n✅ Repository content saved to: $outputPath"
