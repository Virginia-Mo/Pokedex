const app = {
 
init() {
    app.eventListeners();
},
eventListeners() {
    const btn = document.getElementById("firstContainer__btn");
    btn.addEventListener("click", app.welcomeAnimation);

    const pokeBtn = document.getElementById("pokeballBtn");
    pokeBtn.addEventListener("click", app.getInputValue);

    const evoBtn = document.getElementById("Evolutions");
    evoBtn.addEventListener("click", app.getEvolutions);
    
    const abilitiesBtn = document.getElementById("Abilities");
    abilitiesBtn.addEventListener("click", app.getAbilities);
    
    const locationsBtn = document.getElementById("Locations");
    locationsBtn.addEventListener("click", app.getGeneration);
    
    const statsBtn = document.getElementById("Stats");
    statsBtn.addEventListener("click", app.getStats);
    
    const randomBtn = document.getElementById("searchBtn__random");
    randomBtn.addEventListener("click", app.getRandomPokemon);
    
    const shinyBtn = document.getElementById("searchBtn__shiny");
    shinyBtn.addEventListener("click",app.getShiny)
    shinyBtn.addEventListener("dblclick",app.getShinyPokemonN)
 
    const topBtn = document.getElementById("cross__top");
    topBtn.addEventListener("click", app.addOnePokemon);

    const rightBtn = document.getElementById("cross__down");
    rightBtn.addEventListener("click", app.addOnePokemon);

    const minusBtn = document.getElementById("cross__left");
    minusBtn.addEventListener("click", app.minusOnePokemon);

    const leftBtn = document.getElementById("cross__right");
    leftBtn.addEventListener("click", app.minusOnePokemon);
    
},
welcomeAnimation() {
    let div = document.getElementById("firstContainer");
    let cont = document.querySelector(".container");
    div.classList.add("animate__shakeX");
    setTimeout(app.playAudio, 500);
    setTimeout(app.hidden, 1000);
},
playAudio(){
    const audio = document.querySelector("audio");
    audio.volume = 0.05;
    audio.play()
},
hidden() {
  
    let div = document.getElementById("firstContainer");
    let cont = document.querySelector(".container");
    div.classList.add("hidden")
    cont.classList.add("animate__fadeIn")
    cont.classList.remove("hidden")
} ,
getInputValue(){
   window.inputNumber = document.getElementById("searchBar_input").value;
    if (inputNumber){
   app.getPokemonFromAPI(event,inputNumber) 
}
},
async getPokemonFromAPI(event, number) {
    event.preventDefault();
    try {

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}`);
        window.pokemon = await response.json();

 if (!response.ok) {
    throw new Error("Can't get the pokemon")
 }

  app.createPokemon(pokemon);
 
    }catch (error) {
   
    console.error(error);
  }
    },
createPokemon(infosPokemon){
   const oldImg= document.querySelector(".imgPokemon")
   if (oldImg) {
    oldImg.remove()
   }
   const ulInfos= document.querySelector(".ulInfos")
   if(ulInfos){
    ulInfos.remove();
   }
   const pBoxNumber = document.querySelector("#boxNumber")
   pBoxNumber.innerHTML = '';

   const imgcontainer = document.getElementById("imgPokemon");
   imgcontainer.textContent ='';
   imgcontainer.classList.remove("animate__fadeIn");

    const imgLink = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${infosPokemon.id}.png`;
    const imgContainer = document.getElementById("imgPokemon");
    let img = document.createElement("img");
    img.className="imgPokemon"
    img.src = imgLink
    img.style.width='13rem'
    imgContainer.appendChild(img);
    const weight = infosPokemon.weight/10;
    const height = infosPokemon.height/10;

    const nameInput =infosPokemon.name.toUpperCase();
    document.getElementById("pokemonName").textContent = nameInput;
    const pInfos = document.createElement("p");
    pInfos.className = "pInfos";
    pInfos.style.lineHeight ="1.5rem";
    pInfos.style.margin = "0.2rem";
    pInfos.textContent = `N°${infosPokemon.id} \n\n ${weight}Kg  \n\n  ${height}m`;
    const box =document.getElementById("boxNumber")
    box.appendChild(pInfos);

    const typesContainer = document.querySelectorAll(".type");
    typesContainer[0].textContent = infosPokemon.types[0].type.name;

    if(infosPokemon.types[1].type.name !== undefined){
        typesContainer[1].textContent = infosPokemon.types[1].type.name;
    } else {
         return typesContainer[1].textContent = '';
    }
    const idP = infosPokemon.id;
    window.divHidden = document.getElementById("firstContainer");
    window.divHidden.textContent = idP
    console.log(window.divHidden)

},
getImgInfos(){
    window.img= document.querySelector(".imgPokemon");
    window.imgContainer = document.getElementById("imgPokemon");
    window.ulInfs= document.querySelector(".ulInfos");
},
getShiny(){
    app.getImgInfos();
    if (ulInfs){
        ulInfs.remove()
    }

    const shinyImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${pokemon.id}.png`;
    img.src = shinyImg;
    imgContainer.appendChild(img);
},
getShinyPokemonN(){
    app.getPokemonFromAPI(event,pokemon.id)
},
async getEvolutions(){
app.getImgInfos()
    try {
        let response = '';
        // Getting the searched pokemon in a different URL to get the evolution Chain 
        // if(typeof(window.divHidden.textContent) !== 'undefined'){
        //     response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${window.divHidden.textContent}`);
        // } else {
            response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`);
        // }
        const evolutionPokemon = await response.json();
        console.log(evolutionPokemon)

 if (!response.ok) {
    throw new Error("Can't get the pokemon")
 }         
    const evolutions = evolutionPokemon.evolution_chain.url
    console.log(evolutions)
    // Getting the pokemon first evolution name
    const response2 = await fetch(evolutions);
    const evolutionChain = await response2.json();
    if (!response2.ok) {
        throw new Error("Can't get the evolution chain")
     }         

    let evolutionFound = evolutionChain.chain.evolves_to[0].species.name;
    
    if(!evolutionFound){
        return
    }
    if (pokemon.name === evolutionFound) {
        evolutionFound = evolutionChain.chain.evolves_to[0].evolves_to[0].species.name;
    }
    if (typeof(evolutionChain.chain.evolves_to[0].evolves_to[0]) !== 'undefined' && pokemon.name === evolutionChain.chain.evolves_to[0].evolves_to[0].species.name ) {
        return
    } 
    //  Getting the evolved pokemon infos
    const response3 = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolutionFound}`);
    let pokemonFound = await response3.json();
    if (!response3.ok) {
        throw new Error("Can't get the evolved pokemon")
     }   

   return app.createPokemon(pokemonFound)

    }catch (error) {
   
    console.error(error);
  }

},
getAbilities(){
    app.getImgInfos();
    if (imgContainer) {
        imgContainer.textContent ='';
    }
    if(ulInfs){
        ulInfs.remove();
       }
    if(ulInfs){
        ulInfs.remove();
    }
    const abilities = pokemon.abilities;
    console.log(abilities)
    let ul = document.createElement("ul")
    ul.style.margin = "0";
    ul.className ="ulInfos"
    for (const ability of abilities){
    const li = document.createElement("li");
        li.textContent= ability.ability.name;
        li.style.padding = "1.2rem";
        ul.appendChild(li)
    }

    imgContainer.classList.toggle("animate__fadeIn")
    imgContainer.appendChild(ul)
    return
},
async getGeneration(){
    app.getImgInfos();
    if (imgContainer) {
        imgContainer.textContent ='';
    }
    if(ulInfs){
        ulInfs.remove();
       }
       
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
    const generation = await response.json();

    imgContainer.classList.toggle("animate__fadeIn")
    imgContainer.textContent = generation.generation.name.toUpperCase();
    return
},
getStats(){
    app.getImgInfos();
    if (imgContainer) {
        imgContainer.textContent ='';
    }
    if(ulInfs){
        ulInfs.remove();
       }
       
    const stats = pokemon.stats;
    let ul = document.createElement("ul")
    ul.className = "ulInfos"
    for (const stat of stats){
        const base = stat.base_stat;
        const statName = stat.stat.name;
        const li = document.createElement("li");
        li.textContent= `${statName} : ${base}%`;
        li.style.lineHeight = "1.3rem";
        li.style.textAlign ="start";
        li.style.fontSize = "0.9rem"
        ul.appendChild(li)
    }

    imgContainer.classList.toggle("animate__fadeIn")
    imgContainer.appendChild(ul)
    return
},
getRandomPokemon(){
      const  min = Math.ceil(0);
        const max = Math.floor(899);
      let number =  Math.floor(Math.random() * (max - min +1)) + min;

      app.getPokemonFromAPI(event, number)

    }, 
addOnePokemon(){
    let newId = pokemon.id;
    newId++
    app.getPokemonFromAPI(event,newId)
},
minusOnePokemon(){
    let newId = pokemon.id;
    newId--
    app.getPokemonFromAPI(event,newId)
}
  

};
document.addEventListener("DOMContentLoaded", app.init)