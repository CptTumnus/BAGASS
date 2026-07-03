let percent = 0;

const bar = document.getElementById("fill");

const text = document.getElementById("percent");

const timer = setInterval(() => {

    percent++;

    bar.style.width = percent + "%";

    text.innerHTML = percent + "%";

    if(percent >= 100){

        clearInterval(timer);

        text.innerHTML = "Champion Loaded";

    }

},40);
