; NSIS installer hooks, wired in through bundle.windows.nsis.installerHooks.

; Show "LFC-ISLET" as the publisher in Windows' installed-apps list.
;
; bundle.publisher stays unset on purpose: the installer finds the previous
; install folder under Software\<publisher>\LFC-ISLET (the publisher defaults to
; the first two segments of the identifier, here "com"). Changing it would make
; updates lose a custom install folder, and a manual reinstall would call the
; old uninstaller without a folder. Rewriting only the displayed value after the
; template has written its own keeps that lookup intact.
!macro NSIS_HOOK_POSTINSTALL
  WriteRegStr SHCTX "${UNINSTKEY}" "Publisher" "LFC-ISLET"
!macroend
