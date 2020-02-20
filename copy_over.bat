@echo off
del /Q /S "C:\xampp\htdocs"
xcopy "dist\Frontend" "C:\xampp\htdocs" /E /Y
