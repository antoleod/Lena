@echo off
setlocal EnableExtensions

cd /d "%~dp0"

set INSTALL_PLAYWRIGHT=0
if /i "%~1"=="/playwright" set INSTALL_PLAYWRIGHT=1

echo [1/6] Verificando Node.js...
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js no esta instalado o no esta en PATH.
  echo Instala Node.js 20 LTS y vuelve a ejecutar este archivo.
  exit /b 1
)

for /f "delims=" %%i in ('node -p "process.versions.node.split('.').slice(0,2).join('.')"') do set NODE_VERSION=%%i
for /f "tokens=1,2 delims=." %%a in ("%NODE_VERSION%") do (
  set NODE_MAJOR=%%a
  set NODE_MINOR=%%b
)

if %NODE_MAJOR% LSS 18 (
  echo ERROR: Este proyecto requiere Node.js 18.18+.
  echo Version detectada: %NODE_VERSION%
  exit /b 1
)

echo [2/6] Limpiando instalacion previa...
if exist node_modules rmdir /s /q node_modules

echo [3/6] Instalando dependencias desde package-lock.json...
call npm ci
if errorlevel 1 (
  echo ERROR: npm ci fallo.
  exit /b 1
)

echo [4/6] Compilando el proyecto para validar dependencias...
call npm run build
if errorlevel 1 (
  echo ERROR: La compilacion fallo.
  exit /b 1
)

if "%INSTALL_PLAYWRIGHT%"=="1" goto install_playwright
goto done

:install_playwright
echo [5/6] Instalando navegadores de Playwright...
call npx playwright install
if errorlevel 1 (
  echo ERROR: Playwright no pudo instalar sus navegadores.
  exit /b 1
)

:done
echo [6/6] Listo.
echo.
echo Comandos utiles:
echo   npm run dev
echo   npm test
echo   npm run test:e2e
echo.
echo Para instalar browsers de Playwright:
echo   setup-windows.bat /playwright
exit /b 0
