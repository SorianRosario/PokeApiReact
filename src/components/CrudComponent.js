// src/components/CrudComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CrudComponent.css';

const CrudComponent = () => {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonName, setPokemonName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // URL base de la API de Pokémon
  const pokemonApiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  const fetchPokemons = async () => {
    setLoading(true);
    setError(null);
    try {
      const pokemonPromises = [];
      for (let i = 1; i <= 12; i++) {
        pokemonPromises.push(axios.get(`${pokemonApiUrl}${i}`));
      }
      
      const responses = await Promise.all(pokemonPromises);
      
      setPokemons(responses.map(response => response.data));
    } catch (err) {
      setError('Error al cargar los Pokémon');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener un Pokémon por su nombre
  const fetchPokemonByName = async (name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${pokemonApiUrl}${name.toLowerCase()}`);
      setPokemons([response.data]);
    } catch (err) {
      setError('Pokémon no encontrado');
    } finally {
      setLoading(false);
    }
  };

  // Función que maneja el submit del formulario de búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (pokemonName) {
      fetchPokemonByName(pokemonName);
    }
  };

  // Cargar los primeros 12 Pokémon al montar el componente
  useEffect(() => {
    fetchPokemons();
  }, []);

  return (
    <div className="pokemon-container">
      <h1>Pokémon</h1>

      {error && <p className="error">{error}</p>}

      {/* Barra de búsqueda */}
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Ingresa el nombre del Pokémon"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)} 
        />
        <button type="submit">Buscar</button>
      </form>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="pokemon-list">
          {/* Mostrar los Pokémon como cartas */}
          {pokemons.map((pokemon) => (
            <div key={pokemon.id} className="pokemon-card">
              <h2>{pokemon.name}</h2>
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="pokemon-image"
              />
              <p><strong>Altura:</strong> {pokemon.height / 10} m</p>
              <p><strong>Peso:</strong> {pokemon.weight / 10} kg</p>
              <h3>Habilidades:</h3>
              <ul>
                {pokemon.abilities.map((ability) => (
                  <li key={ability.ability.name}>{ability.ability.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CrudComponent;
