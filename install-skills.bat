@echo off
REM Momentum Quest - Skills Installation Script (Windows)
REM This script copies the custom skills to your global Claude Code skills directory

echo ========================================
echo Momentum Quest - Installing Skills
echo ========================================
echo.

REM Get the user's home directory
set SKILLS_SOURCE=%~dp0docs\skills
set SKILLS_DEST=%USERPROFILE%\.claude\skills\momentum-quest

echo Source: %SKILLS_SOURCE%
echo Destination: %SKILLS_DEST%
echo.

REM Create the destination directory if it doesn't exist
if not exist "%USERPROFILE%\.claude\skills\" mkdir "%USERPROFILE%\.claude\skills\"
if not exist "%SKILLS_DEST%" mkdir "%SKILLS_DEST%"

echo Copying skill files...
echo.

REM Copy all .md files
xcopy /Y /Q "%SKILLS_SOURCE%\*.md" "%SKILLS_DEST%\"

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Skills installed to: %SKILLS_DEST%
echo.
echo You can now use these skills:
echo   /game-director
echo   /accelerometer-expert
echo   /gacha-expert
echo   /qa-expert
echo   /ui-expert
echo   /art-director
echo   /performance-expert
echo   /audio-expert
echo   /content-writer
echo.
echo Happy building!
echo ========================================
pause
