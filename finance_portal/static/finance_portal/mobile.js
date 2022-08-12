
//for Mobile Menu opening interaction
const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");

const Btn = document.querySelectorAll('a');



menuBtn.addEventListener('click', () => {
    sideMenu.style.display = "block";
    console.log("clicked!");
})

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = "none";
})
//



