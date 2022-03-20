const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(morgan('common'));



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
  
  // GET requests
  app.use(express.static('public'));

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
