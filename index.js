const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const morgan = require("morgan");

app.use(morgan('common'));

app.use(bodyParser.json())

let topMovies = [
    {
      title: 'Black Hawk Down'
    },
    {
      title: 'Ace Ventura: When Nature Calls'
    },
    {
      title: 'Wall-E'
    },
    {
      title: "Star Trek"
    },
    {
      title: "Star Wars"
    },
    {
      title: "Dragon Ball Z Broly: The Legendary Super Sayian"
    },
    {
      title: "Water Boy"
    },
    {
      title: "Matrix"
    },
    {
      title: "Ong Bak 2 - The Elephant Lord"
    },
    {
      title: "Bad Boys"
    }
  ];


  app.use(express.static('public'));

  // GET requests
  app.get('/', (req, res) => {
    res.send(`You just performed a GET Reuqest for documentation.html`);
    res.status(200)
  });

  app.get('/user', (req, res) => {
    res.send('Successful GET');
    res.status(200)
  })

  app.put('/user', (req, res) => {
    res.send('Successful PUT');
    res.status(200)
  });

  app.post('/user', (req, res) => {
    res.send('Successful POST');
    res.status(200)
  });

  app.delete('/user', (req, res) => {
    res.send('Successful DELETE');
    res.status(200)
  });



  app.get('/', (req, res) => {
    res.send('Welcome to the movie theater!');
  });

  app.get('/movies', (req, res) => {
    res.json(topMovies);
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });
