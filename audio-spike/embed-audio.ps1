param(
  [string]$IndexPath = (Join-Path $PSScriptRoot '..\index.html')
)

$ErrorActionPreference = 'Stop'
$startMarker = '<!-- AUDIO_SYSTEM_EMBED_START -->'
$endMarker = '<!-- AUDIO_SYSTEM_EMBED_END -->'
$placeholder = '<!-- AUDIO_SYSTEM_EMBED -->'
$audioDirectory = Join-Path $PSScriptRoot 'audio'
$systemPath = Join-Path $PSScriptRoot 'audio-system.js'
$indexFullPath = [IO.Path]::GetFullPath($IndexPath)

$entries = foreach ($file in Get-ChildItem -LiteralPath $audioDirectory -Filter '*.ogg' -File | Sort-Object Name) {
  $base64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($file.FullName))
  "  `"$($file.Name)`": `"data:audio/ogg;base64,$base64`""
}

$assets = "{`n$($entries -join ",`n")`n}"
$system = [IO.File]::ReadAllText($systemPath)
$block = @"
$startMarker
<script>
const SOLSTICE_AUDIO_ASSETS = $assets;
$system
</script>
$endMarker
"@

$index = [IO.File]::ReadAllText($indexFullPath)
if ($index.Contains($placeholder)) {
  $index = $index.Replace($placeholder, $block)
} else {
  $start = $index.IndexOf($startMarker, [StringComparison]::Ordinal)
  $end = $index.IndexOf($endMarker, [StringComparison]::Ordinal)
  if ($start -lt 0 -or $end -lt $start) {
    throw 'Audio embed marker was not found in index.html.'
  }
  $end += $endMarker.Length
  $index = $index.Substring(0, $start) + $block + $index.Substring($end)
}

[IO.File]::WriteAllText($indexFullPath, $index, [Text.UTF8Encoding]::new($false))

$audioBytes = (Get-ChildItem -LiteralPath $audioDirectory -Filter '*.ogg' -File |
  Measure-Object Length -Sum).Sum
Write-Host "Embedded $($entries.Count) Ogg files ($([math]::Round($audioBytes / 1KB, 1)) KiB) into $indexFullPath"
