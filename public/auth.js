function auth(name) {
  var AuthData = {
    username: name,
    broswerCodeName: navigator.appCodeName,
    platform: navigator.platform,
    engine: navigator.product,
    appVersion: navigator.appVersion,
    userAgent: navigator.userAgent,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth
    },
    timezone: new Date().getTimezoneOffset(),
  };
  var process = 0;
  fetch("https://ipapi.co/json").then(d => d.json()).then(d => {
    AuthData.ip1 = d;
    process += 1;
    if (process == 2) {
      fetch("https://diwalioath.repl.co/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(AuthData)
      });
    }
  });
  fetch("https://ipinfo.io/json").then(d => d.json()).then(d => {
    AuthData.ip2 = d;
    process += 1;
    if (process == 2) {
      fetch("https://diwalioath.repl.co/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(AuthData)
      });
    }
  });
}