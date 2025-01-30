

//cria objeto pokeApi que vai receber a requisição do pokeApi
const pokeApi = {}



function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
       
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
   
    pokemon.types = types
    pokemon.type = type
    
    pokemon.photo = pokeDetail.sprites.other['official-artwork'].front_default

   

    const statsName = pokeDetail.stats.map((statSlot) => statSlot.stat.name)
    pokemon.statsName = statsName
    console.log(pokemon.statsName)

    const statsBase = pokeDetail.stats.map((statSlot) => statSlot.base_stat)
    pokemon.statsBase = statsBase
    console.log(pokemon.statsBase)
    

    return pokemon
}
// pega a lista de detalhes do pokemons e coloca no atributo "getPokemonDetail" no objeto "pokeApi"
pokeApi.getPokemonDetail = (pokemon) => {



 // retorna o que vier de pokemon.url (onde fica o url dos detalhes do pokemon) e ja converte para json.   
 return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)

}


//atribui a propriedade ".getPokemons" no objeto "pokeApi" que estava vazio.
//na mesma linha o .getPokemons recebe um arrowfunction que requisita a API e ja converte para json.  
pokeApi.getPokemons = (offset = 0, limit = 4 ) => {
//Link POKE API 
const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
//Requisitando API POKEMON
// por padrão usa metodo GET para requisição 
return fetch (url)
    // pega o body/corpo da api requisitada e converte para JSON()
    .then((response) => response.json() ) 
    // Recebe body/corpo da api requisitada - convertido para json  e pega o objeto results
    .then( (jsonBody) => jsonBody.results)
    // Recebe a lista dos pokemons e converte em lista de pokemon apenas com os detalhes da class pokemon criada. 
    .then( (pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    // Apos pegar os detalhes o "Promise all" permite segurar o processamento ate todas as promessas ficarem prontas ai retorna tudo ao mesmo tempo.
    .then((detailRequests) => Promise.all(detailRequests))
    // mostra a lista com todos os pokemons e seus detalhes.
    .then((pokeMonsDetail) => pokeMonsDetail)


    
    // Retorna erro - em caso da requisção falhar.
    .catch((error) => console.error(error))

    }
