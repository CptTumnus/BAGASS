// ==========================================
// BAGASS Championship
// players.js
// Master Player Database
// ==========================================

const players = [

{
    id: "tom",
    name: "Tom Williams",
    nickname: "The Laid-Back Strategist",

    favouriteGame: "Magic: The Gathering",
    favouriteFood: "Chicken & Black Olive Pizza",
    leastFavouriteGame: "Crash Team Racing",
    favouriteColour: "Pink",
    luckyNumber: 3,

    quote: "Every pizza is personal.",

    playStyle: "Laid Back",

    victorySong: "Gnarkill - Skeletor Vs Beastman",

    secret: "Cancelled a date to eat three pizzas and drink amaretto in a paddling pool with another man I met two weeks earlier.",

    portrait: "images/tom.png",
    card: "images/tomcard.png",

    seasonOneChampion: false,
    currentChampion: false
},

{
    id: "paul",
    name: "Paul Barnett",
    nickname: "The Strategist",

    favouriteGame: "Heat",
    favouriteFood: "Pizza",
    leastFavouriteGame: "UNO No Mercy",
    favouriteColour: "Orange",
    luckyNumber: 11,

    quote: "Strategy. Focus. Win.",

    playStyle: "Strategist",

    victorySong: "All I Do Is Win",

    secret: "My favourite Pokémon is Squirtle.",

    portrait: "images/paul.png",
    card: "images/paulcard.png",

    seasonOneChampion: true,
    currentChampion: false
},

{
    id: "jake",
    name: "Jake Tinsley",
    nickname: "The Chaotic Strategist",

    favouriteGame: "Hearthstone",
    favouriteFood: "Crumpets",
    leastFavouriteGame: "Life",
    favouriteColour: "Orange",
    luckyNumber: 33,

    quote: "Get fucked noob.",

    playStyle: "Aggressive / Chaotic / Strategist",

    victorySong: "Holding Out For A Hero",

    secret: "Deeply closeted gay guy.",

    portrait: "images/jake.png",
    card: "images/jakecard.png",

    seasonOneChampion: false,
    currentChampion: false
},

{
    id: "rachel",
    name: "Rachel Barnett",
    nickname: "The Competitive Supporter",

    favouriteGame: "Disney Villains",
    favouriteFood: "Pizza",
    leastFavouriteGame: "Articulate",
    favouriteColour: "Purple",
    luckyNumber: 11,

    quote: "Fake it till you make it 😂",

    playStyle: "Supportive / Competitive",

    victorySong: "Simply The Best",

    secret: "I repeat myself like a parrot to make sure people hear me.",

    portrait: "images/rachel.png",
    card: "images/rachelcard.png",

    seasonOneChampion: false,
    currentChampion: false
},

{
    id: "sarah",
    name: "Sarah Thurmer",
    nickname: "The Wildcard",

    favouriteGame: "Trivial Pursuit",
    favouriteFood: "Roast Dinner",
    leastFavouriteGame: "Cards Against Humanity",
    favouriteColour: "Blue",
    luckyNumber: 27,

    quote: "It's the taking part that counts.",

    playStyle: "Wildcard",

    victorySong: "The Man",

    secret: "I hate frogs. They make me want to vomit.",

    portrait: "images/sarah.png",
    card: "images/sarahcard.png",

    seasonOneChampion: false,
    currentChampion: false
},

{
    id: "stacey",
    name: "Stacey Williams-Sparks",
    nickname: "The Clueless Explorer",

    favouriteGame: "Takenoko",
    favouriteFood: "Paul's Tacos",
    leastFavouriteGame: "Unknown",
    favouriteColour: "Red",
    luckyNumber: 2,

    quote: "What is happening?",

    playStyle: "Clueless",

    victorySong: "Danger Zone",

    secret: "I don't know? 😂",

    portrait: "images/stacey.png",
    card: "images/staceycard.png",

    seasonOneChampion: false,
    currentChampion: false
}

];


// ==========================================
// Help Functions
// ==========================================

// Find player by ID

function getPlayer(id){

    return players.find(player => player.id === id);

}


// Get all players

function getPlayers(){

    return players;

}


// Future use...

console.log("Loaded", players.length, "BAGASS players");
