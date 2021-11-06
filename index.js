const { google } = require('googleapis');
const express = require('express');
const path = require("path");

const Filter = require('bad-words');
const naughtyWords = require('naughty-words');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const app = express();
const bodyParser = require('body-parser');
const apiRequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minute
  max: 10, // limit each IP to 10 requests per windowMs
  handler: function (req, res, /*next*/) {
    return res.status(429).json({
      error: 'You have been Rate Limited! Please try after sometime.'
    })
  }
})
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['diwalioath.repl.co']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.json());
app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.static(path.join(__dirname + '/public/')));



var restWords = []; // Don't make const
const nonRestWords = ['am', 'god'];

for (list in naughtyWords) { restWords = restWords.concat(naughtyWords[list]); }
filter = new Filter({ placeHolder: '*' });
filter.addWords(...restWords);
filter.removeWords(...nonRestWords);




var admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.ADMIN_KEY);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  databaseAuthVariableOverride: {
    uid: process.env.SECRET_DATABASE_UID
  }
});
const db = admin.database();

const people = db.ref("peoples");
const author = db.ref("authdata");

peoples = [], PeopleStore = [];

people.on('child_added', snap => {
  var val = snap.val();
  PeopleStore.push({name: val, key: snap.key});
  peoples = [];
  for(x of PeopleStore){
    peoples.push(x.name);
  }
  console.log("New Name Added", val);
});

people.on('child_removed', snap => {
  const deletedUsr = snap.val();
  PeopleStore = PeopleStore.filter(usr => usr.name != deletedUsr);
  peoples = [];
  for(x of PeopleStore){
    peoples.push(x.name);
  } 
  console.log("New Name Removed", snap.val());
});

app.get('/count', (req, res) => {
  res.status(200).json({ count: peoples.length.toString() || 0 });
});

app.get("/oathtakers", async (req, res) => {
  res.status(200).json(peoples);
});

app.get("/takeoath/:name", apiRequestLimiter, (req, res) => {
  if (!req.params || !req.params.name || peoples.includes(req.params.name)) {
    return res.status(200).json({ data: "Invalid Request", code: 200 });
  }
  var name = req.params.name;
  try{
    name = filter.clean(name);
  }
  catch(e){
      console.log(e)
  }
  google.discoverAPI(process.env.PERSPECTIVE_DISCOVERY_URL)
    .then(client => {
      const analyzeRequest = {
        comment: {
          text: name,
        },
        requestedAttributes: {
          TOXICITY: {},
        },
      };

      client.comments.analyze(
        {
          key: process.env.PERSPECTIVE_API_KEY,
          resource: analyzeRequest,
        },
        (err, response) => {
console.log(response)
          if (response && response.data && response.data.attributeScores && response.data.attributeScores.TOXICITY && response.data.attributeScores.TOXICITY.summaryScore && response.data.attributeScores.TOXICITY.summaryScore.value && response.data.attributeScores.TOXICITY.summaryScore.value > 0.7) {
            people.push(name).then(d => {
              return res.status(200).json({ data: "Oath Successful!" });
            })
              .catch(d => {
                return res.status(200).json({ data: "Oath Successful!" });
              })
          }

          if (err) {
            console.log(err)
            people.push(name).then(d => {
              return res.status(200).json({ data: "Oath Successful!" });
            })
              .catch(d => {
console.log(d);
                return res.status(200).json({ data: "Oath Successful!" });
              })
          }
        });
    })
    .catch(err => {
      people.push(name).then(d => {
        return res.status(200).json({ data: "Oath Successful!" });
      })
        .catch(d => {
console.log(d);
          return res.status(200).json({ data: "Oath Successful!" });
        })
      console.error(err);
    });
});

app.post("/auth", (req, res) => {

})

app.listen(3000, () => {
  console.log('Server reaady to take Oaths!');
});
