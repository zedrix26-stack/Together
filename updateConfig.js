/* =========================================================
   Together - in-app update configuration.

   The Android app checks the official GitHub release feed for
   a newer APK. Only the repository configured below is ever
   accepted; anything else is rejected before it is offered.

   To ship an update:
     1. Build + sign a release APK (must use the Together keystore).
     2. Push the .apk to a new GitHub Release (tag like v1.1.0).
        Optionally attach "<apk>.sha256" for an integrity digest.
   ========================================================= */
window.TOGETHER_UPDATE_CONFIG = {
    enabled: true,
    owner: 'zedrix26-stack',
    repo: 'Update',
    fetchReleaseEndpoint: 'https://api.github.com/repos/zedrix26-stack/Update/releases/latest',
    webVersion: '1.0',
    checkOnLaunch: true,
    reminderHours: 24
};
