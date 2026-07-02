// -----------------------------
// BAGASS v1.0
// script.js
// -----------------------------

// Enter Championship button

const enterButton = document.getElementById("enterButton");

enterButton.addEventListener("click", function () {

    document.getElementById("mainMenu").scrollIntoView({

        behavior: "smooth"

    });

});


// -----------------------------
// Menu Navigation
// -----------------------------

function scrollToSection(sectionID){

    document.getElementById(sectionID).scrollIntoView({

        behavior:"smooth"

    });

}


// -----------------------------
// Player Cards
// -----------------------------

const cards = document.querySelectorAll(".flip-card");

cards.forEach(card => {

    card.addEventListener("click", function(){

        // Close every other card

        cards.forEach(other => {

            if(other !== card){

                other.classList.remove("flipped");

            }

        });

        // Toggle clicked card

        card.classList.toggle("flipped");

    });

});


// -----------------------------
// Future Placeholder
// -----------------------------

console.log("BAGASS v1.0 Loaded Successfully");
