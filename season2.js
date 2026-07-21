// ==========================================
// BAGASS Championship
// Season Two
// ==========================================

const season2 = {

    season: 2,

    title: "Season Two",

    points: {

        first: 2,
        second: 1

    }

};


// ==========================================
// Calculate League Table
// ==========================================

function getLeagueTable(){

    // Create an empty table from the players list

    const table = players.map(player => ({

        player: player.id,

        firsts: 0,
        seconds: 0,
        played: 0,
        points: 0

    }));


    // Read every game

    games.forEach(game => {

        game.results.forEach(result => {

            const entry = table.find(p => p.player === result.player);

            if(!entry) return;

            entry.played++;

            if(result.position === 1){

                entry.firsts++;
                entry.points += season2.points.first;

            }

            if(result.position === 2){

                entry.seconds++;
                entry.points += season2.points.second;

            }

        });

    });


    // Sort League

    table.sort((a,b)=>{

        if(b.points !== a.points){

            return b.points - a.points;

        }

        if(b.firsts !== a.firsts){

            return b.firsts - a.firsts;

        }

        return b.seconds - a.seconds;

    });

    return table;

}


console.log("Season Two Loaded");