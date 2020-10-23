git update-index --skip-worktree 400.md
git update-index --skip-worktree CNAME
del 400.md
del CNAME

@ECHO OFF
SETLOCAL

SET someOtherProgram=SomeOtherProgram.exe
TASKKILL /IM "%someOtherProgram%"

ECHO "This script will now self-destruct. Please ignore the next error message"
del "%~f0"