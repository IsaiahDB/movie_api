const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const morgan = require("morgan");
const mongoose = require('mongoose');
const Models = require('./model.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


  app.use(express.static('public/documentation.html'));

  // GET requests
  app.get('/', (req, res) => {
    res.send(`You just performed a GET Reuqest for documentation.html`);
    res.status(200)
  });

  app.get('/users', (req, res) => {
    Users.find()
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }, 
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

  app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

  app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((users) => {
        if (!users) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  app.get('/movie', (req, res) => {
    Movies.find()
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  app.put('/movie/:Title', (req, res) => {
    Movies.findOneAndUpdate({ Title: req.params.Title }, { $set:
      {
        Title: req.body.Title,
        Description: req.body.Description,
        Genre: req.body.Genre,
        Director: {
          Name: req.body.Name,
          Bio: req.body.Bio
        },
      }
    },
    { new: true }, 
    (err, updatedMovie) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedMovie);
      }
    });
  });

  app.post('/movie', (req, res) => {
    Movies.findOne({ Title: req.body.Title })
      .then((movie) => {
        if (movie) {
          return res.status(400).send(req.body.Title + 'already exists');
        } else {
          Movies
            .create({
              Title: req.body.Title,
              Description: req.body.Description,
              Genre: req.body.Genre,
              Director: {
                Name: req.body.Name,
                Bio: req.body.Bio
              },
              
            })
            .then((movie) =>{res.status(201).json(movie) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

  app.delete('/movie/:Title', (req, res) => {
    Movies.findOneAndRemove({ Title: req.params.Title })
      .then((movie) => {
        if (!movie) {
          res.status(400).send(req.params.Title + ' was not found');
        } else {
          res.status(200).send(req.params.Title + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });



  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });