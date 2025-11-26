
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

// --- Home Page Specific Functions (Weather & Spotlights) ---
const url = "data/company.json";
// OpenWeatherMap API details
const weatherKey = 'cedcb8de997b43dc5c88b3559ac6ac37'; // <<< REPLACE WITH YOUR KEY  53.759268989086934, -2.7067683811831498 Preston UK
const chamberLat = 53.76; // Example Latitude
const chamberLon = -2.707; // Example Longitude (e.g., New York)
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${chamberLat}&lon=${chamberLon}&units=imperial&appid=${weatherKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${chamberLat}&lon=${chamberLon}&units=imperial&appid=${weatherKey}`;

/**
 * Fetches and displays current weather data.
 */
async function getChamberWeather() {
    try {
        // Fetch current weather
        const response = await fetch(weatherUrl);
        const data = await response.json();
        
        // Update Current Weather Display
        document.getElementById('current-temp').textContent = `${Math.round(data.main.temp)}°F`;
        const desc = data.weather[0].description;
        document.getElementById('weather-desc').textContent = desc.charAt(0).toUpperCase() + desc.slice(1);
        
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const weatherIcon = document.getElementById('weather-icon');
        weatherIcon.setAttribute('src', iconUrl);
        weatherIcon.setAttribute('alt', data.weather[0].main + ' Icon');

        // Fetch 3-day forecast
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        // Filter and display the forecast (one reading per day)
        const forecastList = document.getElementById('forecast-container');
        forecastList.innerHTML = ''; // Clear 'loading' message
        
        // We look for noon (12:00:00) forecasts for the next 3 days
        const threeDayForecast = forecastData.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);

        threeDayForecast.forEach(day => {
            const date = new Date(day.dt * 1000);
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
            const temp = Math.round(day.main.temp);

            const p = document.createElement('p');
            p.innerHTML = `<strong>${dayOfWeek}</strong>: ${temp}°F`;
            forecastList.appendChild(p);
        });

    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weather-desc').textContent = 'Could not load weather data.';
    }
}

/**
 * Loads and displays random Gold/Silver member spotlights.
 */
async function displaySpotlights() {
    const spotlightsContainer = document.getElementById('spotlights-section');
    spotlightsContainer.innerHTML = ''; // Reset/Add Heading

    try {
        const response = await fetch(url);
        const members = await response.json();

        // 1. Filter for Gold and Silver members
        const eligibleMembers = members.filter(
            member => member.membershipLevel === 'Gold' || member.membershipLevel === 'Silver'
        );

        // 2. Randomly select 2-3 unique members
        const numToDisplay = 3; //Math.floor(Math.random() * 2) + 2; // 2 or 3
        const selectedMembers = [];
        const availableIndices = Array.from({ length: eligibleMembers.length }, (_, i) => i);

        for (let i = 0; i < numToDisplay && availableIndices.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableIndices.length);
            const memberIndex = availableIndices.splice(randomIndex, 1)[0]; // Remove index
            selectedMembers.push(eligibleMembers[memberIndex]);
        }
        
        // 3. Render the selected members
        selectedMembers.forEach(member => {
            const card = document.createElement('div');
            card.className = 'spotlight-card card';
            
            card.innerHTML = `
                <img src="${member.imageurl}" alt="${member.name} logo" loading="lazy">
                <h4>${member.name}</h4>
                <p class="membership-level">${member.membershipLevel} Member</p>
                <hr>
                <p>📞 ${member.phone}</p>
                <p>📍 ${member.address}</p>
                <p>🌐 <a href="${member.websiteurl}" target="_blank">${member.websiteurl.replace('https://', '')}</a></p>
            `;
            spotlightsContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching member data:', error);
        const errorCard = document.createElement('div');
        errorCard.className = 'spotlight-card card';
        errorCard.innerHTML = '<p>Could not load member spotlights.</p>';
        spotlightsContainer.appendChild(errorCard);
    }
}

// Call the main functions when the page loads
getChamberWeather();
displaySpotlights();

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



// JOIN PAGE JS
document.addEventListener('DOMContentLoaded', function() {
            
    // --- MODAL HANDLER FUNCTIONS ---
    
    // Function to close a specific modal element
    function closeModal(modalElement) {
        if (modalElement) {
            modalElement.classList.remove('active');
            modalElement.style.display = 'none'; 
        }
    }

    // Function to open a specific modal element
    function openModal(modalElement) {
        if (modalElement) {
            modalElement.classList.add('active');
            modalElement.style.display = 'block';
        }
    }

    // --- 1. OPENING LOGIC (Learn More buttons) ---
    // Select all buttons with the class 'open-modal-btn'
    const openButtons = document.querySelectorAll('.open-modal-btn');

    openButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the target modal ID (e.g., 'modal-np') from the data attribute
            const modalId = this.getAttribute('data-target-modal'); 
            const targetModal = document.getElementById(modalId);
            openModal(targetModal);
        });
    });

    // --- 2. CLOSING LOGIC (The 'x' span) ---
    // Target all elements with the class 'modal-close'
    const closeButtons = document.querySelectorAll('.modal-close');

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Traverse up the DOM tree from the clicked span to find its parent modal
            const targetModal = this.closest('.modal');
            closeModal(targetModal);
        });
    });
    
    // --- 3. CLOSING BY CLICKING OUTSIDE (Backdrop) ---
    window.addEventListener('click', function(event) {
        // If the click occurred directly on an element with the class 'modal' 
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });
});
// Set the timestamp when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }
});

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById('modal-' + modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById('modal-' + modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside of modal content
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
        }
    }
});

// THANKYOU PAGE JS
// Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    const firstName = urlParams.get('firstName') || '';
    const lastName = urlParams.get('lastName') || '';
    const email = urlParams.get('email') || '';
    const phone = urlParams.get('phone') || '';
    const businessName = urlParams.get('businessName') || '';
    const timestamp = urlParams.get('timestamp') || '';

    // Format the timestamp
    let formattedDate = '';
    if (timestamp) {
    const date = new Date(timestamp);
    formattedDate = date.toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short'
    });
    }

    // Populate the summary content
    const summaryContent = document.getElementById('summaryContent');
    summaryContent.innerHTML = `
    <div class="summary-row">
        <div class="summary-item">
            <p class="summary-label">First Name</p>
            <p class="summary-value">${firstName}</p>
        </div>
        <div class="summary-item">
            <p class="summary-label">Last Name</p>
            <p class="summary-value">${lastName}</p>
        </div>
    </div>
    <div class="summary-item summary-full">
        <p class="summary-label">Email Address</p>
        <p class="summary-value">${email}</p>
    </div>
    <div class="summary-item summary-full">
        <p class="summary-label">Mobile Phone</p>
        <p class="summary-value">${phone}</p>
    </div>
    <div class="summary-item summary-full">
        <p class="summary-label">Business/Organization Name</p>
        <p class="summary-value">${businessName}</p>
    </div>
    <div class="summary-item summary-full">
        <p class="summary-label">Submitted On</p>
        <p class="summary-value">${formattedDate}</p>
    </div>
    `;