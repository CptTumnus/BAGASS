let percent = 0;

const bar = document.getElementById("fill");
const text = document.getElementById("percent");
const status = document.querySelector(".status");

const messages = [

    "Loading Champion...",

    "Checking Pizza Inventory...",

    "Loading Hair Gel...",

    "Consulting VAR...",

    "Rigging Slot Machine...",

    "Deleting Tom's Victories...",

    "Giving Paul Another Trophy...",

    "Generating Excuses...",

    "Checking Dice Luck...",

    "Calibrating Smug Meter...",

    "Champion Found."

];

const timer = setInterval(() => {

    percent++;

    bar.style.width = percent + "%";

    text.innerHTML = percent + "%";

    if(percent < 10)
        status.innerHTML = messages[0];

    else if(percent < 20)
        status.innerHTML = messages[1];

    else if(percent < 30)
        status.innerHTML = messages[2];

    else if(percent < 40)
        status.innerHTML = messages[3];

    else if(percent < 50)
        status.innerHTML = messages[4];

    else if(percent < 60)
        status.innerHTML = messages[5];

    else if(percent < 70)
        status.innerHTML = messages[6];

    else if(percent < 80)
        status.innerHTML = messages[7];

    else if(percent < 90)
        status.innerHTML = messages[8];

    else if(percent < 100)
        status.innerHTML = messages[9];

    if(percent >= 100){

        clearInterval(timer);

        status.innerHTML = messages[10];

        text.innerHTML = "ACCESS GRANTED";

    }

},40);
