'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const POKEDEX = require('./pokedex.json');

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'dev';
app.use(morgan(morganSetting));

const validTypes = ['Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychich', 'Rock', 'Steel', 'Water'];

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if(!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({error: 'Unauthorized request'});
  }
  
  next();
});

function handleGetTypes(req, res) {
  res.json(validTypes);
}

app.get('/types', handleGetTypes);

function handleGetPokemon(req, res) {
  const { name, type } = req.query;
  let pokemons = POKEDEX.pokemon;

  if (name) {
    pokemons = pokemons.filter( pokemon => pokemon.name.toLowerCase().includes(name.toLowerCase()) );
  }

  if (type) {
    pokemons = pokemons.filter( pokemon => pokemon.type.includes(type) );
  }

  res
    .status(200)
    .json(pokemons);
}

app.get('/pokemon', handleGetPokemon);

app.use((error, req, res, next) => {
  let response;
  if(process.env.NODE_ENV === 'produciton') {
    response = { error: { message: 'server error' } };
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT);