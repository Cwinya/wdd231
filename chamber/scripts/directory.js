const url = "data/members.json";
const gridbutton = document.querySelector("#grid");
const listbutton = document.querySelector("#list");

const cards = document.querySelector(".companies");
cards.innerHTML = "";

gridbutton.addEventListener("click", () => {
    cards.classList.add("grid");
    cards.classList.remove("list");
});

listbutton.addEventListener("click", showList);
function showList() {
    cards.classList.add("list");
    cards.classList.remove("grid");
}


// Function to determine the membership level eg. Gold
const getLevelName = (levleObject) => {
    let highestLevel = "";
    let highestValue = 0;

    // Iterate over the keys (members, silver, gold) in the membership object
    for (const [key, value] of Object.entries(levleObject)) {
        if (value > highestValue) {
            highestValue = value;
            highestLevel = key;
        }
    }
    // capitalize the first letter for the display
    return highestLevel.charAt(0).toUpperCase() + highestLevel.slice(1);
}

async function getCompanyData() {
    const response = await fetch(url);
    const data = await response.json();
    displayCompany(data.companynames);
}
getCompanyData();

const displayCompany = (companynames) => {
    companynames.forEach((companyname) => {
        const levelName = getLevelName(companyname.membershiplevel)
        let card = document.createElement("section");
        let image = document.createElement("img");
        let name = document.createElement("h2");
        let number = document.createElement("p");
        let detail = document.createElement("p");
        // let websitelink = document.createElement("p");

        image.setAttribute('src', companyname.imageurl);
        image.setAttribute('alt', `image of ${companyname.name}`);
        image.setAttribute('loading', 'lazy');
        image.setAttribute('width', '340');
        image.setAttribute('height', '400');
        name.textContent = `${companyname.name}`;
        number.innerHTML = `${companyname.address}`;
        detail.textContent = `Membership Level: ${levelName}`;
        // websitelink.innerHTML = `${companyname.websiteurl}`;

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(number);
        card.appendChild(detail);
        // card.appendChild(websitelink);

        cards.appendChild(card);
    });
}

// NAVIGATION
const navbtn = document.querySelector("#ham-btn");
const navbar = document.querySelector("#nav-bar")

navbtn.addEventListener('click', () => {
    navbtn.classList.toggle('show');
    navbar.classList.toggle('show');
});

const lastModifiedDate = document.lastModified;
console.log("Last Modified;", lastModifiedDate);
document.getElementById("lastModified").textContent = "Last Modofication: " + lastModifiedDate;

// AUTOMATIC SLIDE SHOW
let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "block";
  setTimeout(showSlides, 5000); // Change image every 2 seconds
}
