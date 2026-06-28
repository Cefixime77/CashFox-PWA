@echo off
chcp 65001 >nul
echo ========================================
echo   CashFox PWA - iPhone 测试启动器
echo ========================================
echo.

REM 获取局域网 IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set IP=%%a
    set IP=!IP:~1!
)

echo [1] 本机局域网 IP: %IP%
echo.

REM 启动 Vite 开发服务器 (监听所有网络接口)
echo [2] 启动开发服务器...
start "" npx vite --host 0.0.0.0 --port 5173

REM 等待服务器就绪
timeout /t 3 /nobreak >nul

echo [3] 启动 localtunnel 公网隧道...
echo.
echo ========================================
echo   在 iPhone Safari 中打开以下任一地址:
echo ========================================
echo.
echo   局域网: http://%IP%:5173
echo.

REM 启动 localtunnel
npx localtunnel --port 5173

pause
