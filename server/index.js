const express = require('express');
const morgan = require('morgan');
const cors  = require('cors');
const monk  = require('monk');

const app = express();

const db = monk('localhost/meower');
const mews = db.get('mews');

app.use(morgan('short'));
app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
  res.json('Hola Mundo');
});

app.get('/mews', (req, res) => {
  mews.find().then(mews => {
    res.json(mews);
  });
});

function isValidatedMew(mew) {
  return mew.name && mew.name.toString().trim() != '' &&
  mew.content && mew.content.toString().trim() != '';
}

app.post('/mews', (req,res) => {
  if(isValidatedMew(req.body)){
    const mew = {
      name: req.body.name.toString(),
      content: req.body.content.toString(),
      created: new Date()
    };
    mews.insert(mew).then(createdMew => {
      res.json(createdMew);
    });
  } else {
    res.status(422);
    res.json({
      message: 'Hey! Name and content are required!'
    }); 
  }
});

app.listen(5000, () =>{
  console.log('server on port http://localhost:5000');
  
})