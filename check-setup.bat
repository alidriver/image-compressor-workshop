@echo off
REM Pre-flight check before running `npm start` (Windows).
REM Verifies Node and npm, with friendly fix-it messages.
REM Designers: double-click this file. A window will pop up.

setlocal enabledelayedexpansion

set "MIN_NODE_MAJOR=20"
set "ERRORS=0"

echo.
echo Pre-flight check
echo ----------------

REM --- Node ---
where node >nul 2>nul
if errorlevel 1 (
  echo   [X] Node.js is not installed
  echo       Download the LTS installer: https://nodejs.org
  echo       After installing, close and reopen this window.
  set /a ERRORS+=1
) else (
  for /f "tokens=*" %%v in ('node --version') do set "NODE_VERSION=%%v"
  set "VER=!NODE_VERSION:v=!"
  for /f "tokens=1 delims=." %%a in ("!VER!") do set "NODE_MAJOR=%%a"
  if !NODE_MAJOR! LSS %MIN_NODE_MAJOR% (
    echo   [X] Node !NODE_VERSION! ^(need v%MIN_NODE_MAJOR% or newer^)
    echo       Update from https://nodejs.org - install the latest LTS.
    set /a ERRORS+=1
  ) else (
    echo   [OK] Node !NODE_VERSION!
  )
)

REM --- npm ---
where npm >nul 2>nul
if errorlevel 1 (
  echo   [X] npm is not installed
  echo       It comes bundled with Node - try reinstalling from https://nodejs.org
  set /a ERRORS+=1
) else (
  for /f "tokens=*" %%v in ('npm --version') do set "NPM_VERSION=%%v"
  echo   [OK] npm !NPM_VERSION!
)

echo.
if !ERRORS! GTR 0 (
  echo Not ready yet. Fix the items above, then run this script again.
  echo.
  pause
  exit /b 1
)

echo You're good - run: npm start
echo.
echo Tip: in VS Code, open the NPM Scripts panel in the Explorer sidebar
echo      and click the play button next to "start" - no terminal needed.
echo.
pause
