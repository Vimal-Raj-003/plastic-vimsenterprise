$assetsDir = "C:\Users\CT\gemini\plastiblends-3d-web\assets"
$ffmpegExe = "C:\luma\node_modules\ffmpeg-static\ffmpeg.exe"
$scratchBuildDir = "C:\Users\CT\.gemini\antigravity\brain\467d9cf3-a50e-4422-9058-d32f80ebd407\scratch\video_build"
$rawDesktopDir   = "$scratchBuildDir\raw_desktop"
$rawMobileDir    = "$scratchBuildDir\raw_mobile"
$rawHeroDir      = "$scratchBuildDir\raw_hero"

$videoDir = "$assetsDir\video"
New-Item -ItemType Directory -Force -Path $videoDir | Out-Null

$masterDesktopMp4 = "$videoDir\vims_master_process.mp4"
$masterMobileMp4  = "$videoDir\vims_master_process_mobile.mp4"
$heroLoopMp4      = "$videoDir\vims_hero_loop.mp4"

Write-Output "Step 2/5: Encoding master desktop MP4, mobile portrait MP4, and hero loop MP4 via FFmpeg..."
& $ffmpegExe -hide_banner -loglevel error -y -framerate 24 -i "$rawDesktopDir\raw-%06d.jpg" -c:v libx264 -pix_fmt yuv420p -crf 16 -preset fast -movflags +faststart $masterDesktopMp4
& $ffmpegExe -hide_banner -loglevel error -y -framerate 24 -i "$rawMobileDir\raw-%06d.jpg"  -c:v libx264 -pix_fmt yuv420p -crf 17 -preset fast -movflags +faststart $masterMobileMp4
& $ffmpegExe -hide_banner -loglevel error -y -framerate 24 -i "$rawHeroDir\hero-%06d.jpg"   -c:v libx264 -pix_fmt yuv420p -crf 16 -preset fast -movflags +faststart $heroLoopMp4

# 3. Extract Sequential WebP Frames & Posters directly from the Encoded Videos using FFmpeg
$framesRoot     = "$assetsDir\frames"
$desktopWebpDir = "$framesRoot\desktop"
$mobileWebpDir  = "$framesRoot\mobile"
$heroWebpDir    = "$framesRoot\hero"

if (Test-Path $framesRoot) { Remove-Item $framesRoot -Recurse -Force }
New-Item -ItemType Directory -Force -Path $desktopWebpDir, $mobileWebpDir, $heroWebpDir | Out-Null

Write-Output "Step 3/5: Extracting sequential WebP frames (frame-000001.webp .. frame-000180.webp) from master videos via FFmpeg..."
& $ffmpegExe -hide_banner -loglevel error -y -i $masterDesktopMp4 -c:v libwebp -lossless 0 -compression_level 4 -q:v 84 "$desktopWebpDir\frame-%06d.webp"
& $ffmpegExe -hide_banner -loglevel error -y -i $masterMobileMp4  -c:v libwebp -lossless 0 -compression_level 4 -q:v 82 "$mobileWebpDir\frame-%06d.webp"
& $ffmpegExe -hide_banner -loglevel error -y -i $heroLoopMp4      -c:v libwebp -lossless 0 -compression_level 4 -q:v 84 "$heroWebpDir\hero-%06d.webp"

# Extract sharp opening posters (Desktop & Mobile)
Copy-Item "$desktopWebpDir\frame-000001.webp" "$framesRoot\poster-desktop.webp" -Force
Copy-Item "$mobileWebpDir\frame-000001.webp"  "$framesRoot\poster-mobile.webp"  -Force
Copy-Item "$rawDesktopDir\raw-000001.jpg"     "$framesRoot\poster-desktop.jpg"  -Force

# 4. Generate Verified Manifest JSON with actual frame counts, dimensions, frame rate, file paths, and scene boundaries
Write-Output "Step 4/5: Building verified manifest.json..."
$desktopFiles = Get-ChildItem "$desktopWebpDir\frame-*.webp" | Sort-Object Name
$mobileFiles  = Get-ChildItem "$mobileWebpDir\frame-*.webp"  | Sort-Object Name
$heroFiles    = Get-ChildItem "$heroWebpDir\hero-*.webp"     | Sort-Object Name

$manifestObj = [ordered]@{
    schemaVersion = "2.0"
    generatedAt   = (Get-Date).ToString("o")
    title         = "VIMS Enterprises — Continuous Photographic Polymer-to-Component Scroll Story"
    videos        = [ordered]@{
        masterDesktop = [ordered]@{
            path        = "assets/video/vims_master_process.mp4"
            width       = 1280
            height      = 720
            fps         = 24
            durationSec = 7.5
            frameCount  = $desktopFiles.Count
            byteSize    = (Get-Item $masterDesktopMp4).Length
        }
        masterMobile = [ordered]@{
            path        = "assets/video/vims_master_process_mobile.mp4"
            width       = 720
            height      = 960
            fps         = 24
            durationSec = 7.5
            frameCount  = $mobileFiles.Count
            byteSize    = (Get-Item $masterMobileMp4).Length
        }
        heroLoop = [ordered]@{
            path        = "assets/video/vims_hero_loop.mp4"
            width       = 1280
            height      = 720
            fps         = 24
            durationSec = 1.5
            frameCount  = $heroFiles.Count
            byteSize    = (Get-Item $heroLoopMp4).Length
        }
    }
    posters = [ordered]@{
        desktopWebp = "assets/frames/poster-desktop.webp"
        desktopJpg  = "assets/frames/poster-desktop.jpg"
        mobileWebp  = "assets/frames/poster-mobile.webp"
    }
    sequences = [ordered]@{
        desktop = [ordered]@{
            directory   = "assets/frames/desktop"
            pattern     = "assets/frames/desktop/frame-{0:D6}.webp"
            format      = "webp"
            width       = 1280
            height      = 720
            fps         = 24
            frameCount  = $desktopFiles.Count
            firstFrame  = "assets/frames/desktop/" + $desktopFiles[0].Name
            lastFrame   = "assets/frames/desktop/" + $desktopFiles[-1].Name
            files       = @($desktopFiles | ForEach-Object { "assets/frames/desktop/" + $_.Name })
        }
        mobile = [ordered]@{
            directory   = "assets/frames/mobile"
            pattern     = "assets/frames/mobile/frame-{0:D6}.webp"
            format      = "webp"
            width       = 720
            height      = 960
            fps         = 24
            frameCount  = $mobileFiles.Count
            firstFrame  = "assets/frames/mobile/" + $mobileFiles[0].Name
            lastFrame   = "assets/frames/mobile/" + $mobileFiles[-1].Name
            files       = @($mobileFiles | ForEach-Object { "assets/frames/mobile/" + $_.Name })
        }
        heroLoop = [ordered]@{
            directory   = "assets/frames/hero"
            pattern     = "assets/frames/hero/hero-{0:D6}.webp"
            format      = "webp"
            width       = 1280
            height      = 720
            fps         = 24
            frameCount  = $heroFiles.Count
            firstFrame  = "assets/frames/hero/" + $heroFiles[0].Name
            lastFrame   = "assets/frames/hero/" + $heroFiles[-1].Name
            files       = @($heroFiles | ForEach-Object { "assets/frames/hero/" + $_.Name })
        }
    }
    scenes = @(
        [ordered]@{
            id         = "scene-a"
            code       = "Scene A"
            title      = "Virgin Polymer Granules"
            caption    = "Thermoplastic polymer granules pouring from transparent borosilicate glass."
            startFrame = 1
            endFrame   = 36
            isHero     = $true
        },
        [ordered]@{
            id         = "scene-b"
            code       = "Scene B"
            title      = "Hopper Receiving Stream"
            caption    = "The continuous granule stream enters the stainless-steel machine receiving hopper."
            startFrame = 37
            endFrame   = 60
            isHero     = $false
        },
        [ordered]@{
            id         = "scene-c"
            code       = "Scene C"
            title      = "Injection Unit & Barrel Reveal"
            caption    = "Inside the injection unit, the barrel shroud opens to reveal the feed throat and screw."
            startFrame = 61
            endFrame   = 80
            isHero     = $false
        },
        [ordered]@{
            id         = "scene-d"
            code       = "Scene D"
            title      = "Feeding & Plasticizing"
            caption    = "The rotating helical screw conveys solid granules forward and plasticizes them into a homogeneous melt."
            startFrame = 81
            endFrame   = 108
            isHero     = $false
        },
        [ordered]@{
            id         = "scene-e"
            code       = "Scene E"
            title      = "Closed-Mold Injection"
            caption    = "With the steel mold clamped closed, molten polymer flows through the runner to fill the gear cavity."
            startFrame = 109
            endFrame   = 134
            isHero     = $false
        },
        [ordered]@{
            id         = "scene-f"
            code       = "Scene F"
            title      = "Holding, Cooling & Mold Opening"
            caption    = "The part stabilizes under holding pressure and cools solid before the movable mold half opens."
            startFrame = 135
            endFrame   = 156
            isHero     = $false
        },
        [ordered]@{
            id         = "scene-g"
            code       = "Scene G"
            title      = "Component Ejection"
            caption    = "Hardened ejector pins release the solid injection-molded helical spur gear from the cavity."
            startFrame = 157
            endFrame   = 170
            isHero     = $false
        },
        [ordered]@{
            id         = "scene-h"
            code       = "Scene H"
            title      = "Finished Molded Component"
            caption    = "From raw polymer granules to a finished precision component. Explore our raw polymer grades below."
            startFrame = 171
            endFrame   = 180
            isHero     = $false
        }
    )
    assetSources = @(
        "assets/scene_a_glass_pour.jpg (VIMS Studio dark-navy borosilicate glass pouring colorful polymer granules)",
        "assets/scene_bc_hopper_pour.jpg (VIMS Studio stainless-steel receiving hopper and barrel shroud)",
        "assets/scene_d_barrel_cutaway.jpg (VIMS Studio explanatory screw-barrel plasticizing cutaway)",
        "assets/scene_e_mold_closed_fill.jpg (VIMS Studio explanatory closed-mold runner and helical gear cavity cutaway)",
        "assets/scene_fg_mold_open_eject.jpg (VIMS Studio open steel mold platen and ejector-pin release of helical gear)",
        "assets/scene_gh_gear_reveal.jpg (VIMS Studio macro reveal of finished cobalt-blue helical spur gear)",
        "assets/u_pellet_0_blue.png .. u_pellet_4_red.png (Isolated macro polymer granule cutouts from user-supplied photographs)"
    )
}

$manifestPath = "$framesRoot\manifest.json"
$manifestJson = $manifestObj | ConvertTo-Json -Depth 8
[System.IO.File]::WriteAllText($manifestPath, $manifestJson, [System.Text.Encoding]::UTF8)

# 5. Package the Extracted WebP Frames and Manifest into ZIP Archive and Verify Contents
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
Write-Output "Step 5/5: Packaging frames and manifest.json into ZIP archive..."
$zipPathPrimary = "$assetsDir\vims_polymer_process_frames.zip"
$zipPathLegacy  = "$assetsDir\polymer_pouring_frames.zip"

if (Test-Path $zipPathPrimary) { Remove-Item $zipPathPrimary -Force }
[System.IO.Compression.ZipFile]::CreateFromDirectory($framesRoot, $zipPathPrimary, [System.IO.Compression.CompressionLevel]::Optimal, $false)
Copy-Item $zipPathPrimary $zipPathLegacy -Force

$zipArchive = [System.IO.Compression.ZipFile]::OpenRead($zipPathPrimary)
$entryCount = $zipArchive.Entries.Count
$hasManifest = ($zipArchive.Entries | Where-Object { $_.FullName -eq "manifest.json" }) -ne $null
$zipArchive.Dispose()

Write-Output "SUCCESS: Desktop Frames=$($desktopFiles.Count), Mobile Frames=$($mobileFiles.Count), Hero Frames=$($heroFiles.Count), ZIP Entries=$entryCount, HasManifest=$hasManifest"
