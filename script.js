const btn=document.querySelector('.btn');
const msgs=['ROLL THE DICE!','ONE MORE TURN!','LET THE GAMES BEGIN!'];
let i=0;
setInterval(()=>{i=(i+1)%msgs.length;btn.textContent=msgs[i]},2500);
