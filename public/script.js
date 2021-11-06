var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var image = document.getElementById("certificate_template");
var imageLoaded = false;

image.addEventListener("load", function () {
  imageLoaded = true;
});

function createCertificate(name) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, 842, 595);
  ctx.font = "normal 500 36px/46px 'Google Sans Display', sans-serif";
  ctx.fillStyle = "#F05F57";
  wrapText(ctx, "I " + name + ", take the oath that I’ll not use Products like fireworks that harm our Environment, Earth and will try to reduce pollution. And also will create awareness about this in people of our socities. ", 36, 136, 782, 46);
}

function getCertificateURL() {
  return canvas.toDataURL("image/png");
}


function wrapText(context, text, x, y, maxWidth, lineHeight) {

  var words = text.split(' '),
    line = '',
    lineCount = 0,
    i,
    test,
    metrics;

  for (i = 0; i < words.length; i++) {
    test = words[i];
    metrics = context.measureText(test);
    while (metrics.width > maxWidth) {
      // Determine how much of the word will fit
      test = test.substring(0, test.length - 1);
      metrics = context.measureText(test);
    }
    if (words[i] != test) {
      words.splice(i + 1, 0, words[i].substr(test.length))
      words[i] = test;
    }

    test = line + words[i] + ' ';
    metrics = context.measureText(test);

    if (metrics.width > maxWidth && i > 0) {
      context.fillText(line, x, y);
      line = words[i] + ' ';
      y += lineHeight;
      lineCount++;
    }
    else {
      line = test;
    }
  }

  context.fillText(line, x, y);
}



function form(e) {
  e.preventDefault();
  document.getElementById("submit").disabled = true;
  var f = e.target;
  var name = f.name.value;
  createCertificate(name);
  var url = getCertificateURL();
  document.getElementById("oath-certificate-img").src = url;
  document.getElementById("download-certificte").download = "Diwali Oath Certificate.png";
  document.getElementById("download-certificte").href = url;
  document.getElementById("oath_taker_counter").innerText = parseInt(document.getElementById("oath_taker_counter").innerText) + 1;
  var list = document.getElementById("oath-taker-list");
  var c = document.createElement("li");
  var h = document.createElement("h3");
  h.innerText = name;
  c.appendChild(h);
  list.appendChild(c);
  fetch("https://diwalioath.repl.co/takeoath/" + name, {
    "method": "GET",
  })
    .then(r => r.json())
    .catch(err => {
      document.getElementById("take-oath").hidden = true;
      document.getElementById("oath-certificate").hidden = false;
      document.getElementById("submit").disabled = false;
    })
    .then(res => {
      document.getElementById("take-oath").hidden = true;
      document.getElementById("oath-certificate").hidden = false;
      document.getElementById("submit").disabled = false;
    })
    .catch(err => {
      document.getElementById("take-oath").hidden = true;
      document.getElementById("oath-certificate").hidden = false;
      document.getElementById("submit").disabled = false;
    })
  auth(name);
}

async function share() {
  var blob = await fetch(getCertificateURL()).then(r => r.blob());
  var file = new File([blob], "Diwali Oath Certificate.png", { type: "image/png" });
  if (navigator.canShare && navigator.canShare({
    title: "Diwali Oath",
    url: "https://diwalioath.repl.co",
    files: [file]
  })) {
    navigator.share(navigator.share({
      title: "Diwali Oath",
      url: "https://diwalioath.repl.co",
      text: "I just took the oath of Diwali to make our Earth free of pollution. You should also take it at https://diwalioath.repl.co/.",
      files: [file]
    })).catch(err => {
      // console.log(err);
    });
  } else {
    alert(`Your system doesn't support sharing files.`);
  }
}

document.getElementById("share-certificate").addEventListener("click", share);

function getOathTakers() {
  fetch("https://diwalioath.repl.co/oathtakers", {
    "method": "GET",
  })
    .then(r => r.json())
    .catch(err => {
      console.log("Couldn't get oath takers' names");
    })
    .then(res => {
      var list = document.getElementById("oath-taker-list");
      list.innerHTML = "";
      for (a of res) {
        var c = document.createElement("li");
        var h = document.createElement("h3");
        h.innerText = a;
        c.appendChild(h);
        list.appendChild(c);
      }
    })
    .catch(err => {
      console.log("Couldn't get oath takers' names");
    });
}

function getCurrentOathCount() {
  fetch("https://diwalioath.repl.co/count", {
    "method": "GET",
  })
    .then(r => r.json())
    .catch(err => {
      console.log("Couldn't get number of oath takers");
    })
    .then(res => {
      document.getElementById("oath_taker_counter").innerText = res.count;
    })
    .catch(err => {
      console.log("Couldn't get number of oath takers");
    })
}

getCurrentOathCount();
getOathTakers();