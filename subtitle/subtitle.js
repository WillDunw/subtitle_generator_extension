// tick=1;
// while(tick<= 20) {
//     setTimeout(() => {
//         console.log("tick #" + tick++)
// },1000 * tick);
// }

document.addEventListener("DOMContentLoaded", function () {
  let state = document.getElementById("state");
  let toggle = document.getElementById("toggle");
  let is_generating = false;

  toggle.addEventListener("change", function (event) {
    state.innerText = "Loading...";
    if (event.target.checked) {
      is_generating = true;
      document.getElementById("state").innerText = "On";
    } else {
      is_generating = false;
      document.getElementById("state").innerText = "Off";
    }
  });
});