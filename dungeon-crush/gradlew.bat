@echo off
setlocal
if not defined JAVA_HOME set "JAVA_HOME=%ProgramFiles%\Android\Android Studio\jbr"
"%JAVA_HOME%\bin\java.exe" -classpath "%~dp0gradle\wrapper\gradle-wrapper.jar" org.gradle.wrapper.GradleWrapperMain %*
