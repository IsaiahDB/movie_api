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
  app.get('/doc/documentation', (req, res) => {
    res.send(`You just performed a GET Reuqest for documentation.html`);
    res.status(200)
  });

  app.put('/documentation/update', (req, res) => {
    res.send('Successful GET request returning data on all the students');
    res.status(200)
  });

  app.post('/documentation/create', (req, res) => {
    reS.send('You just performed a POST Request');
    res.status(200)
  });

  app.delete('/documentation/delete', (req, res) => {
    res.send('Successful GET request returning data on all the students');
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
