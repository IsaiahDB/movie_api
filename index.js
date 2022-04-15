const express = require("express");
const app = express();
const bodyParser = require('body-parser');

const morgan = require("morgan");
const mongoose = require('mongoose');
const Models = require('./model.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('common'));

const cors = require('cors');
app.use(cors());
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


  app.use(express.static('public'));

  const { check, validationResult } = require("express-validator");
  // GET requests
  app.get('/', (req, res) => {
    res.send(`You just performed a GET Reuqest for documentation.html`);
    res.status(200)
  });

  app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
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

  app.post('/users',
    [
      check('Username', 'Username is required').isLength({min: 5}),
      check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
      check('Password', 'Password is required').not().isEmpty(),
      check('Email', 'Email does not appear to be valid').isEmail()
    ], 
    (req, res) => {

    // check the validation object for errors
      let errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      let hashedPassword = Users.hashPassword(req.body.Password);
      Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
        .then((user) => {
          if (user) {
            //If the user is found, send a response that it already exists
            return res.status(400).send(req.body.Username + ' already exists');
          } else {
            Users
              .create({
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
              })
              .then((user) => { res.status(201).json(user) })
              .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
              });
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        });
    }
  );

    

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

  app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title}) // Find the movie by title
    .then((movie) => {
      if(movie){ // If movie was found, return json, else throw error
        res.status(200).json(movie);
      } else {
        res.status(400).send('Movie not found');
      };
    })
    .catch((err) => {
      res.status(500).send('Error: '+ err);
    });
  });

  app.put('/movies/:Title', (req, res) => {
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

  app.post('/movies', (req, res) => {
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
              Director: {Name: req.body.Name, Bio: req.body.Bio}
              
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

  app.delete('/movies/:Title', (req, res) => {
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

  const port = process.env.PORT || 8080;
  app.listen(port, '0.0.0.0',() => {
    console.log('Listening on Port ' + port);
   });
   