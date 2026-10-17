@echo off
title Push Divya Portfolio to GitHub
cls
echo ======================================================================
echo             DIVYA SAHARAN PORTFOLIO - GITHUB UPLOADER
echo             Target: https://github.com/itzjeet62/Divya-Portfolio
echo ======================================================================
echo.

set "GIT_PATH=C:\Users\i-nomit.choudhary\AppData\Local\Programs\Git\cmd"
if exist "%GIT_PATH%\git.exe" (
    set "PATH=%GIT_PATH%;C:\Users\i-nomit.choudhary\AppData\Local\Programs\Git\mingw64\bin;%PATH%"
)

echo [1/3] Preparing Git files...
git branch -M main
git remote set-url origin https://github.com/itzjeet62/Divya-Portfolio.git
git add -A
git commit -m "Upload complete Divya Saharan Portfolio website" 2>nul

echo.
echo [2/3] Authentication:
echo       - Press ENTER to use Browser Sign-in (popup window)
echo       - OR paste your GitHub Personal Access Token below:
echo.
set /p "GITHUB_TOKEN=Paste Token (or press ENTER): "

echo.
echo [3/3] Uploading portfolio files to GitHub...
echo.

if not "%GITHUB_TOKEN%"=="" (
    git push -u https://%GITHUB_TOKEN%@github.com/itzjeet62/Divya-Portfolio.git main --force
) else (
    git push -u origin main
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================================================
    echo   [SUCCESS] Saari files GitHub par upload ho gayi hain!
    echo   Repository: https://github.com/itzjeet62/Divya-Portfolio
    echo.
    echo   Vercel automatically website redeploy kar raha hai (15-30 sec).
    echo   Aapka 404 NOT_FOUND error theek ho gaya hai!
    echo ======================================================================
) else (
    echo.
    echo ======================================================================
    echo   [FAILED] Push nahi ho paya. Token check karein ya browser allow karein.
    echo ======================================================================
)

echo.
pause

