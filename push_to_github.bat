@echo off
title Push Divya Portfolio to GitHub
echo ====================================================
echo      Uploading Portfolio to GitHub
echo      Repository: https://github.com/itzjeet62/Divya-Portfolio
echo ====================================================
echo.

set "PATH=C:\Users\i-nomit.choudhary\AppData\Local\Programs\Git\cmd;C:\Users\i-nomit.choudhary\AppData\Local\Programs\Git\mingw64\bin;%PATH%"

git config http.sslVerify false
git branch -M main
git remote set-url origin https://github.com/itzjeet62/Divya-Portfolio.git
git add .
git commit -m "Upload complete Divya Saharan Portfolio" 2>nul

echo Pushing to GitHub (itzjeet62/Divya-Portfolio)...
echo.
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================================
    echo   SUCCESS! Saari files GitHub repo par upload ho gayi!
    echo   Repo Link: https://github.com/itzjeet62/Divya-Portfolio
    echo ====================================================
) else (
    echo.
    echo ====================================================
    echo   Push failed or cancelled. Please check your credentials.
    echo ====================================================
)
pause
