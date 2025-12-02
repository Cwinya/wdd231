import { discoverData } from '../data/data.mjs';

// Constants and DOM elements
const LAST_VISIT_KEY = 'chamberLastVisit';
const visitMessageElement = document.getElementById('visit-message');
const gridElement = document.querySelector('.discover-grid');

// New Modal Elements (Assuming IDs from the HTML structure provided previously)
const modal = document.getElementById('item-modal');
const closeButton = document.querySelector('.close-button');


document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Handle Visitor Message using localStorage
    displayVisitMessage();

    // 2. Dynamic Card Generation
    if (gridElement) {
        generateDiscoverCards();
    }
    
    // 3. Setup Modal Close Listeners
    setupModalListeners();
});


/**
 * Generates and inserts the 8 discover cards into the DOM.
 * Also attaches event listeners to the new "Learn More" buttons.
 */
function generateDiscoverCards() {
    let htmlContent = '';
    
    discoverData.forEach(item => {
        const cardHtml = `
            <div id="${item.id}" class="card">
                <h2>${item.title}</h2>
                <figure>
                    <img src="${item.image}" alt="${item.title}" loading="lazy" 
                         width="300" height="200">
                </figure>
                <address>${item.address}</address>
                <p>${item.description}</p>
                <button class="learn-more-btn" data-id="${item.id}">Learn More</button>
            </div>
        `;
        htmlContent += cardHtml;
    });

    gridElement.innerHTML = htmlContent;
    
    // Attach event listeners to all newly created buttons
    document.querySelectorAll('.learn-more-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            openModal(itemId);
        });
    });
}

/**
 * Populates and displays the modal based on the clicked item ID.
 * @param {string} itemId - The ID of the data item (e.g., 'item1').
 */
function openModal(itemId) {
    // Find the item data that matches the clicked button's ID
    const item = discoverData.find(d => d.id === itemId);

    if (item && modal) {
        document.getElementById('modal-title').textContent = item.title;
        document.getElementById('modal-description').textContent = item.description;
        document.getElementById('modal-address').textContent = item.address;
        
        const modalImage = document.getElementById('modal-image');
        modalImage.src = item.image;
        modalImage.alt = item.title;
        
        // Update the link button
        document.getElementById('modal-link').href = item.learnMoreUrl || '#';
        
        // Show the modal
        modal.style.display = 'block';
    }
}

/**
 * Hides the modal.
 */
function closeModal() {
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Sets up event listeners for closing the modal (button, outside click, and Escape key).
 */
function setupModalListeners() {
    if (closeButton) {
        // Close via the 'X' button
        closeButton.addEventListener('click', closeModal);
    }
    
    // Close modal when user clicks anywhere outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal when the escape key is pressed (Accessibility)
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal && modal.style.display === 'block') {
            closeModal();
        }
    });
}


/**
 * Calculates time since last visit using localStorage and displays the appropriate message.
 */
/**
 * Calculates time since last visit using localStorage and displays the appropriate message.
 */
function displayVisitMessage() {
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
    const currentDate = Date.now();
    let message = "";

    // 1. Ensure the message element exists before proceeding
    if (!visitMessageElement) return;

    if (lastVisit === null) {
        // First Visit
        message = "Welcome! Let us know if you have any questions.";
    } else {
        // --- CRITICAL FIX APPLIED HERE ---
        // Convert the string stored in localStorage back to a number
        const lastVisitTimestamp = Number(lastVisit); 
        
        const MS_PER_DAY = 24 * 60 * 60 * 1000;
        
        // Calculate the difference using the numeric timestamp
        const timeDifferenceMs = currentDate - lastVisitTimestamp;
        
        // Use Math.floor to ensure we only count full days for the 'n days ago' message, 
        // as required by the assignment instructions ("whole number of days").
        const daysDifference = Math.floor(timeDifferenceMs / MS_PER_DAY);
        
        if (daysDifference < 1) {
            // This now captures visits less than 1 *full* day ago
            message = "Back so soon! Awesome!";
        } else {
            // One or more full days
            const dayText = daysDifference === 1 ? "day" : "days";
            message = `You last visited ${daysDifference} ${dayText} ago.`;
        }
    }

    // Display the message
    visitMessageElement.textContent = message;

    // Update localStorage with the current visit time (in milliseconds) as a string for the next visit
    localStorage.setItem(LAST_VISIT_KEY, currentDate);
}

const lastModifiedDate = document.lastModified;
console.log("Last Modified;", lastModifiedDate);
document.getElementById("lastModified").textContent = "Last Modofication: " + lastModifiedDate;


// NAVIGATION
const navbtn = document.querySelector("#ham-btn");
const navbar = document.querySelector("#nav-bar")

navbtn.addEventListener('click', () => {
    navbtn.classList.toggle('show');
    navbar.classList.toggle('show');
});

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
