import { useState ,useEffect, useRef } from 'react';
import { Pokemon } from '../components/Pokemon';
import sadBulbasaur from '../images/sad_bulbasaur.png'
import surprisedPikachu from '../images/surprised_pikachu.jpeg'

export default function Pokedex({ currentUser }) {
  // Testing
  // console.log(currentUser.id);

  const [userPokemon, setUserPokemon] = useState([]);

  const isMounted = useRef(false);


  const getPokemonList= async () => {
    await fetch(`http://localhost:8080/pokemon/trainer/${currentUser.id}`)
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      } else {
        console.log(response);
        throw Error(response.statusText);
      }
    })
    // Setting the state with setUserPokemon
    .then((data) => setUserPokemon(data))
  // When currentUser changes the useEffect runs
  .catch(error => {
    console.log(error);
    setUserPokemon([])
  })
   }

  useEffect(() => {
    if (isMounted.current) {
      getPokemonList();
    } else {
      isMounted.current = true;
    }
  }, [currentUser]);

 // delete button function



 const deletePokemonFromDb = async (pokemonId) =>{
  await fetch(`http://localhost:8080/pokemon/${pokemonId}`,
    {
    method: "DELETE",
  });
  // Update rendered list after delete
  getPokemonList();
 }




  // Data is within userPokemon and we want to map the array to display the pokemon

  // The rendered list will be in pokemonList
  let pokemonList = [];

  pokemonList = userPokemon.map((pokemon) => {
    return (
      // We need to make a component called Pokemon which has a singular pokemon
      // The details are passes down as a prop to the pokemon component and the details are stored in the pokemon variable

      <Pokemon key={pokemon.id} pokemon={pokemon} releasePokemon={(pokemonId) => {deletePokemonFromDb(pokemonId); }}/>
    );
  });
  
  // if(userPokemon != [] && isMounted.current){
  //   console.log('Mounted')
  //   console.log(isMounted.current);
    
    
  //   pokemonList = userPokemon.map((pokemon) => {
  //     return (
  //       // We need to make a component called Pokemon which has a singular pokemon
  //       // The details are passes down as a prop to the pokemon component and the details are stored in the pokemon variable
  
  //       <Pokemon key={pokemon.id} pokemon={pokemon} releasePokemon ={(pokemonId) => {deletePokemonFromDb(pokemonId)}} />
  //     );
  //   });
  // }
  

  return (
    <div className="pokedex-page">
      {currentUser==null ? 
      <>
        <img src={surprisedPikachu} alt={`Image of surprised Pikachu`} className="surprised-pikachu" />
        <p>You can't view your Pokédex if you haven't logged in! Please login!</p>
      </>
        :
        <><div className="pokedex-header">
        {/* <h2>{`Hi ${currentUser.name}`}</h2> */}
        <h1>{`${currentUser.name}'s Pokédex`}</h1>
        {/* Change this to user's chosen trainer sprite */}
        <h2>Manage your Pokémon team</h2>
      </div>
      <div className="all-pokemon-container">
        {/* pokemonList has the list of pokemon */}
        {pokemonList.length === 0 ? 
        <> 
        <p>Your Pokédex is empty, please go to the map to catch some Pokémon! </p>
        <img src={sadBulbasaur} alt={`Image of sad Bulbasaur`} className="sad-bulbasaur" />
        </> : pokemonList}
      </div>
      </>
        }
    </div>
  );
}
