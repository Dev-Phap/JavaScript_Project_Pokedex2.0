// Constante que traz o elemento HTML "OL" pelo ID "pokemonList".
const pokemonList = document.getElementById('pokemonList');

// Constante que traz o elemento "button" pelo ID "loadMoreButton".
const loadMoreButton = document.getElementById('loadMoreButton');



// Define o limite de quantos Pokémons serão carregados por vez.
const limit = 12;
// Define o ponto de partida (offset) para a busca de Pokémons.
let offset = 0;

// Define o número máximo de registros (Pokémons) que podem ser carregados.
const maxRecords = 1200;

/*
 * Função que converte um objeto de Pokémon em um item de lista no formato HTML.
 * parametro objeto ( pokemon ) - O objeto contendo os dados do Pokémon.
 * return (strings) - A string representando o HTML do Pokémon.
 */
function convertPokemonToLi(pokemon) {
    return `
        <li class="content_pokemon">
            <div class="flip-card">
                <div class="card-inner pokemon ${pokemon.type}">
                    <div class="card-front"> 
                        <div class="pokemon_header"> 
                            <button type="button" class="button_details">+</button> 
                            <span class="name">${pokemon.name}</span> <!-- Exibe o nome do Pokémon -->
                            <span class="number" style="justify-self: end;">#${pokemon.number}</span> <!-- Exibe o número do Pokémon -->
                        </div>
                    
                        <div class="detail">
                            <!-- Lista os tipos do Pokémon com classes específicas -->
                            <ol class="types">
                                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                            </ol>                            
                            <!-- Exibe a imagem do Pokémon -->
                            <img src="${pokemon.photo}" alt="${pokemon.name}">
                        </div>
                    </div>
                    <!-- para baixo a parte de tras do card -->
                    <div class="card-back">
                        <div class="pokemon_header"> 
                            <button type="button" class="button_details">&#8592</button> 
                            <span class="name">${pokemon.name}</span> <!-- Exibe o nome do Pokémon -->
                            <span class="number" style="justify-self: end;">#${pokemon.number}</span> <!-- Exibe o número do Pokémon -->
                        </div>
                        <div class="back_detail">
                            <div class="stats"> 
                                <h3>⚔️ Base Stats 🛡️</h3>
                                <ol class="list_stats">
                                    ${pokemon.statsName.map((statName, index) => `<li>${statName}: ${pokemon.statsBase[index]} <meter class="meterBar" min="0" max="100" low="30" high="80" optimum="90" value="${pokemon.statsBase[index]}"></li>`).join('')} 
                                </ol>
                            </div>
                        </div>                        
                    </div>
                </div>    
            </div>  
        </li>
    `;
}

/*
 * Função que carrega os Pokémons a partir do offset e limite definidos,
 * e adiciona os itens de lista gerados ao HTML.
 * parametro tipo number (offset) - Posição inicial da lista de Pokémons.
 * parametro tipo number (limit) - Quantidade de Pokémons a carregar.
 */
function loadPokemonItens(offset, limit) {
    // Chama a API para obter os Pokémons com o intervalo especificado.
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        // Converte cada Pokémon em HTML e junta em uma única string.
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        // Adiciona ou contatena os novos Pokémons ao elemento HTML da lista.
        pokemonList.innerHTML += newHtml;

        
        
       
        //função que pega atualiza o estilo do container pela cor do tipo do pokemon que o mouse esta em cima.
         updateContainerStyleByType();
       
        //função que flipa o card do pokemon ao clicar no botao de detalhes.
        flipCardPokemonDetails();
        

    });
}

// Carrega os primeiros Pokémons ao inicializar a página.
loadPokemonItens(offset, limit);

// Adiciona um evento ao botão "Carregar Mais".
loadMoreButton.addEventListener('click', () => {
    // Incrementa o offset para carregar os próximos Pokémons.
    offset += limit;
    // Calcula o número total de registros com a próxima página.
    const qtdRecordsWithNexPage = offset + limit;

    // Verifica se a próxima página excede o número máximo de Pokémons.
    if (qtdRecordsWithNexPage >= maxRecords) {
        // Ajusta o limite para carregar apenas o restante dos Pokémons.
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);



        // Remove o botão "Carregar Mais" após carregar todos os Pokémons.
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        // Carrega a próxima página normalmente.
        loadPokemonItens(offset, limit);
    }
});

// Função que atualiza a cor do box-shadow do container pela cor do tipo do Pokémon que o mouse está em cima.
function updateContainerStyleByType() {
    // Verifica se a condição do @media é verdadeira (largura mínima de 992px)
    const mediaQuery = window.matchMedia('(min-width: 992px)');

    // Função para adicionar os eventos de hover aos cards
    const applyHoverEffects = () => {
        if (mediaQuery.matches) { // Executa apenas se a condição do @media for verdadeira
            // Seleciona todos os elementos HTML com a classe "pokemon", ou seja, os cards
            const cards = document.querySelectorAll('.pokemon');
            // intera para cada elemento o evento de mouseenter e mouseleave
            cards.forEach(card => {
                // Adiciona um evento de mouseenter (quando o mouse entra no card)
                card.addEventListener('mouseenter', handleMouseEnter);
                // Adiciona um evento de mouseleave (quando o mouse sai do card)
                card.addEventListener('mouseleave', handleMouseLeave);
            });
            // Seleciona todos os elementos HTML com a classe "flip-card", ou seja, os cards
            const flipDiv = document.querySelectorAll('.flip-card');
            // intera para cada elemento o evento de mouseenter e mouseleave
            flipDiv.forEach(flip => {
                // Adiciona um evento de mouseenter (quando o mouse entra no card)
                flip.addEventListener('mouseenter', (event) => {
                    const card = event.currentTarget;
                    // Adiciona um efeito de escala no card
                    card.style.transform = 'scale(1.1)';
                });
                // Adiciona um evento de mouseenter (quando o mouse entra no card)
                flip.addEventListener('mouseleave', (event) => {
                    const card = event.currentTarget;
                    // Remove o efeito de escala no card
                    card.style.transform = '';
                } );
            });            

        } else {
            // Remove os eventos de hover quando a condição do @media não é atendida
            const cards = document.querySelectorAll('.pokemon');
            cards.forEach(card => {
                card.removeEventListener('mouseenter', handleMouseEnter);
                card.removeEventListener('mouseleave', handleMouseLeave);
            });

            const flipDiv = document.querySelectorAll('.flip-card');
            flipDiv.forEach(flip => {
                flip.removeEventListener('mouseenter', (event) => {
                    const card = event.currentTarget;
                    card.style.transform = 'scale(1.1)';
                });
                flip.removeEventListener('mouseleave', (event) => {
                    const card = event.currentTarget;
                    card.style.transform = '';
                } );
            });
        }
    };

    // Crio uma função para determina os eventos que vao acontecer quando o mouse entrar no card.
    const handleMouseEnter = (event) => {
        const card = event.currentTarget;
        const cardColor = getComputedStyle(card).backgroundColor;
        const cardColorOpacity = cardColor.replace('0.99)', '0.30)');
        const sections = document.querySelectorAll('.content');
        const body = document.querySelector('body');

        
        
        
        sections.forEach(section => {
            section.style.boxShadow = `${cardColor} 0px 0px 16px 2px, ${cardColor} 0px 0px 16px 2px`;
        });
        
        body.style.backgroundImage = `linear-gradient(90deg, ${cardColorOpacity} 0%, rgba(2,2,40,0) 15%, rgba(2,2,40,0) 85%, ${cardColorOpacity} 100%)`;
        
        
        
    };

    // Crio uma função para determina os eventos que vao acontecer quando o mouse sair do card.
    const handleMouseLeave = (event) => {
        const card = event.currentTarget;
        const sections = document.querySelectorAll('.content');
        const body = document.querySelector('body');
        

        sections.forEach(section => {
            section.style.boxShadow = '';  
        });

        body.style.background = '';
        
       
                
    };

    // Adiciona um listener para monitorar mudanças no tamanho da tela
    mediaQuery.addEventListener('change', applyHoverEffects);

    // Chama a função inicialmente para aplicar os efeitos de hover com base na condição atual
    applyHoverEffects();
}


// Função que flipa o card do pokemon ao clicar no botao de detalhes.
function flipCardPokemonDetails() {
    const flipToDetailsButtons = document.querySelectorAll('.button_details');
    flipToDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const cardInner = button.closest('.card-inner');
            cardInner.classList.toggle('flipped');
        });
    });
}




