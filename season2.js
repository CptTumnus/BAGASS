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

    },

    standings: [

        {
            player: "tom",

            firsts: 0,
            seconds: 0,

            played: 0
        },

        {
            player: "paul",

            firsts: 0,
            seconds: 0,

            played: 0
        },

        {
            player: "jake",

            firsts: 0,
            seconds: 0,

            played: 0
        },

        {
            player: "rachel",

            firsts: 0,
            seconds: 0,

            played: 0
        },

        {
            player: "sarah",

            firsts: 0,
            seconds: 0,

            played: 0
        },

        {
            player: "stacey",

            firsts: 0,
            seconds: 0,

            played: 0
        }

    ]

};


// ==========================================
// Helper Functions
// ==========================================

function getLeagueTable(){

    return season2.standings

        .map(player => ({

            ...player,

            points:

                (player.firsts * season2.points.first) +

                (player.seconds * season2.points.second)

        }))

        .sort((a,b)=>{

            const pointDifference = b.points - a.points;

            if(pointDifference !== 0){

                return pointDifference;

            }

            return b.firsts - a.firsts;

        });

}


console.log("Season Two Loaded");
