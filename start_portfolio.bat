@echo off
title Divya Saharan Portfolio Server
echo ====================================================
echo      Divya Saharan - Portfolio Local Server
echo ====================================================
echo.
echo   PC Link:     http://localhost:3000
echo   Mobile Link: http://172.16.47.44:3000
echo.
echo Press Ctrl+C in this window to stop the server anytime.
echo ====================================================
echo.
python -m http.server 3000 --bind 0.0.0.0
pause
