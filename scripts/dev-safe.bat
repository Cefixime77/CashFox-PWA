@echo off
chcp 65001 >nul
echo ========================================
echo   CashFox PWA - 个人热点模式
echo ========================================
echo.
echo   推荐测试流程:
echo.
echo   1. iPhone: 设置 → 个人热点 → 打开"允许其他人加入"
echo   2. Windows: 连接 WiFi 到 iPhone 的热点
echo   3. 然后运行此脚本
echo.
echo ========================================
echo.
npx vite --host 0.0.0.0 --port 5173
pause
