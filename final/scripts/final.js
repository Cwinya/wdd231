document.addEventListener('DOMContentLoaded', () => {
    // --- Page 1: Home / Astronomy News Logic ---
    const newsContainer = document.getElementById('news-container');

    // MOCK API DATA (Simulating a successful JSON response)
    // Links updated to point to relevant NASA/JPL/Authority pages.
    const mockNewsData = [
        { 
            title: "Perseids Meteor Shower Peaks Tonight!", 
            date: "August 12, 2025", 
            summary: "The annual Perseids shower will reach its maximum rate, offering up to 100 meteors per hour in dark sky locations. Be sure to look northeast after midnight. The Perseids originate from the comet Swift-Tuttle.", 
            source: "NASA/JPL", 
            link: "https://solarsystem.nasa.gov/meteors-comets-asteroids/meteors-and-meteorites/perseids/in-depth/" 
        },
        { 
            title: "Mars and Jupiter in Close Conjunction", 
            date: "September 5, 2025", 
            summary: "The two gas giants will be separated by less than half a degree in the evening sky, a spectacular sight for binoculars or small telescopes. A planetary conjunction occurs when two astronomical objects appear close together as observed from Earth.", 
            source: "Sky & Telescope", 
            link: "https://skyandtelescope.org/astronomy-news/planetary-conjunctions-2025-a-must-see-for-stargazers/" 
        },
        { 
            title: "Webb Telescope Captures New Image of Pillars of Creation", 
            date: "October 20, 2025", 
            summary: "The James Webb Space Telescope released a stunning infrared view of the famous star-forming region in the Eagle Nebula. JWST's infrared capability allows it to pierce through dust, revealing newly formed stars.", 
            source: "ESA/Hubble", 
            link: "https://webbtelescope.org/contents/media/images/2022/058/01GFK7K27H4D9P9T8B6W30571N" 
        }
    ];

    function fetchAstronomyNews() {
        return new Promise(resolve => {
            setTimeout(() => {
                if (newsContainer) { 
                    resolve(mockNewsData);
                }
            }, 1500); 
        });
    }

    function displayNews(newsArray) {
        if (!newsContainer) return;

        newsContainer.innerHTML = ''; 
        
        newsArray.forEach(item => {
            const newsItem = document.createElement('article');
            newsItem.className = 'news-item';
            newsItem.setAttribute('role', 'article'); 

            // The link's href attribute now uses item.link from the mockData
            newsItem.innerHTML = `
                <h3>${item.title}</h3>
                <p><strong>Date:</strong> ${item.date}</p>
                <p>${item.summary}</p>
                <p><a href="${item.link}" target="_blank" aria-label="Read more about ${item.title}">Read More (Source: ${item.source})</a></p>
            `;
            newsContainer.appendChild(newsItem);
        });
    }

    if (newsContainer) {
        fetchAstronomyNews().then(displayNews);
    }
    // ----------------------------------------------------------------------
    
    // --- LOGIN REDIRECT LOGIC (index.html) ---
    const ctaLoginForm = document.getElementById('cta-login-form');
    const nasaRedirectUrl = 'https://worldview.earthdata.nasa.gov/'; // NASA Live Satellite Site

    if (ctaLoginForm) {
        ctaLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // --- SIMULATED LOGIN SUCCESS ---
            window.location.href = nasaRedirectUrl;
        });
    }
    
    // --- MODAL & REGISTRATION LOGIC (index.html) ---
    const registrationModal = document.getElementById('registration-modal');
    const openModalLink = document.getElementById('open-registration-modal');
    const closeModalButton = document.getElementById('close-modal');
    const registrationForm = document.getElementById('registration-form');
    const welcomeMessage = document.getElementById('welcome-message');

    if (openModalLink) { // Ensure we are on index.html
        
        // 1. OPEN MODAL
        openModalLink.addEventListener('click', (e) => {
            e.preventDefault();
            registrationForm.style.display = 'block';
            welcomeMessage.style.display = 'none';
            registrationModal.showModal();
        });

        // 2. CLOSE MODAL
        closeModalButton.addEventListener('click', () => {
            registrationModal.close();
        });

        // 3. HANDLE REGISTRATION SUBMISSION
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const userName = document.getElementById('reg-name').value;
            
            registrationForm.style.display = 'none';
            
            welcomeMessage.innerHTML = `
                <h3>🥳 Thank You for Subscribing, ${userName}!</h3>
                <p>You now have access to personalized features on Stellar Travel. Welcome aboard!</p>
                <button type="button" class="cta-button" id="close-message-btn">Start Exploring</button>
            `;
            welcomeMessage.style.display = 'block';

            document.getElementById('close-message-btn').addEventListener('click', () => {
                registrationModal.close();
            });
            
            registrationForm.reset();
        });
    }
    // ----------------------------------------------------------------------
    
    // --- Page 2: DSO Target Finder Logic (dso-finder.html) ---
    const geoButton = document.getElementById('geo-button');
    const locationInput = document.getElementById('location-input');
    const locationStatus = document.getElementById('location-status');
    const dsoFilterForm = document.getElementById('dso-filter-form');
    const dsoTableBody = document.getElementById('dso-table-body');
    const dsoTable = document.getElementById('dso-table');
    const resultsMessage = document.getElementById('results-message');

    if (geoButton) { // Check if we are on the DSO Finder page
        
        geoButton.addEventListener('click', () => {
            if ('geolocation' in navigator) {
                locationStatus.textContent = 'Attempting to get location...';
                
                // Geolocation API call
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude.toFixed(2);
                        const lon = position.coords.longitude.toFixed(2);
                        
                        locationInput.value = `${lat}, ${lon}`;
                        locationStatus.textContent = `Location set: Lat ${lat}, Lon ${lon}`;
                    },
                    (error) => {
                        locationStatus.textContent = `Error: ${error.message}. Please enter manually.`;
                        console.error('Geolocation Error:', error);
                    },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                );

            } else {
                locationStatus.textContent = 'Geolocation is not supported by your browser.';
            }
        });

        dsoFilterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const [lat, lon] = locationInput.value.split(',').map(s => s.trim());
            
            if (lat && lon && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lon))) {
                findDSOtargets(parseFloat(lat), parseFloat(lon));
            } else {
                resultsMessage.innerHTML = '<p style="color:red;">Please enter valid Latitude and Longitude.</p>';
                dsoTable.classList.add('visually-hidden');
            }
        });

        function findDSOtargets(lat, lon) {
            resultsMessage.innerHTML = '<p style="color: var(--color-secondary);">Searching for visible objects...</p>';
            dsoTableBody.innerHTML = '';
            dsoTable.classList.add('visually-hidden');

            // MOCK DSO DATA based on filters/location
            const mockDSOData = [
                { name: "Andromeda Galaxy (M31)", type: "Galaxy", const: "Andromeda", mag: 3.4, equip: "Binoculars / Small Scope" },
                { name: "Pleiades (M45)", type: "Cluster", const: "Taurus", mag: 1.6, equip: "Naked Eye / Binoculars" },
                { name: "Orion Nebula (M42)", type: "Nebula", const: "Orion", mag: 4.0, equip: "Small Scope" },
                { name: "Ring Nebula (M57)", type: "Nebula", const: "Lyra", mag: 8.8, equip: "Medium Scope" }
            ];

            setTimeout(() => {
                dsoTable.classList.remove('visually-hidden');
                resultsMessage.innerHTML = '';

                mockDSOData.forEach(dso => {
                    const row = dsoTableBody.insertRow();
                    row.innerHTML = `
                        <td>${dso.name}</td>
                        <td>${dso.type}</td>
                        <td>${dso.const}</td>
                        <td>${dso.mag.toFixed(1)}</td>
                        <td>${dso.equip}</td>
                    `;
                });
                document.getElementById('target-count').textContent = `(${mockDSOData.length} found)`;
            }, 1000); 
        }
    }
});


// final.js
// Implements the Deep Sky Object finder application, fetching data from final.json.

let ALL_DSO_DATA = []; // Initialize as an empty array to hold the fetched JSON data
let currentDSOs = ALL_DSO_DATA;

// DOM elements
const dsoListBody = document.getElementById('dso-list');
const resultCountSpan = document.getElementById('result-count');
const typeSelect = document.getElementById('object-type');
const constelationSelect = document.getElementById('constellation');
const filterForm = document.getElementById('filter-form');
const resetButton = document.getElementById('reset-button');

/**
 * Renders the filtered list of DSOs into the table body.
 * @param {Array<Object>} data - The array of Deep Sky Objects to display.
 */
function renderResults(data) {
    dsoListBody.innerHTML = ''; // Clear existing rows
    resultCountSpan.textContent = data.length;

    if (data.length === 0) {
        dsoListBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--color-accent);">No objects found matching the criteria. Try broadening your search!</td></tr>';
        return;
    }

    data.forEach(dso => {
        const row = dsoListBody.insertRow();
        row.innerHTML = `
            <td>${dso.name}</td>
            <td>${dso.designation}</td>
            <td>${dso.type}</td>
            <td>${dso.constellation}</td>
            <td>${dso.magnitude}</td>
        `;
    });
    currentDSOs = data; // Update the current list
}

/**
 * Function to fetch data from the designated JSON file.
 * This uses the correct relative path (../final.json) to access the file from the parent directory.
 */
async function fetchDSOData() {
    try {
        const response = await fetch('file/final.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // The data is successfully loaded into the global variable
        ALL_DSO_DATA = await response.json();
        
    } catch (error) {
        console.error("Could not fetch DSO data. Ensure 'final.json' is located in the parent folder (../final.json).", error);
        // Fallback or display error message to user
        dsoListBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Error loading data. Check console for details.</td></tr>';
        return false; // Indicate failure
    }
    return true; // Indicate success
}


/**
 * Populates the filter dropdowns (Type and Constellation) based on unique values in the data.
 */
function populateFilters() {
    // Ensure ALL_DSO_DATA is an array and not empty before populating filters
    if (!Array.isArray(ALL_DSO_DATA) || ALL_DSO_DATA.length === 0) return;

    // 1. Populate Object Type Filter
    const types = [...new Set(ALL_DSO_DATA.map(dso => dso.type))].sort();
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
    });
    
    // 2. Populate Constellation Filter
    const constellations = [...new Set(ALL_DSO_DATA.map(dso => dso.constellation))].sort();
    constellations.forEach(constellation => {
        const option = document.createElement('option');
        option.value = constellation;
        option.textContent = constellation;
        constelationSelect.appendChild(option);
    });
}

/**
 * Filters the ALL_DSO_DATA based on the current selection in the dropdowns.
 */
function filterDSOs(event) {
    // Prevent default form submission if triggered by the submit button
    if (event) event.preventDefault(); 
    
    const selectedType = typeSelect.value;
    const selectedConstellation = constelationSelect.value;
    
    let filteredData = ALL_DSO_DATA;

    // Filter by Type
    if (selectedType !== 'All') {
        filteredData = filteredData.filter(dso => dso.type === selectedType);
    }
    
    // Filter by Constellation
    if (selectedConstellation !== 'All') {
        filteredData = filteredData.filter(dso => dso.constellation === selectedConstellation);
    }
    
    renderResults(filteredData);
}

/**
 * Resets the form and re-renders all data.
 */
function resetFilters() {
    typeSelect.value = 'All';
    constelationSelect.value = 'All';
    renderResults(ALL_DSO_DATA);
}

/**
 * Initialization function
 * Note: Must be async to wait for the data fetch operation to complete.
 */
async function initFinder() {
    // 1. Load data and wait for it to complete
    const dataLoaded = await fetchDSOData();
    
    if (!dataLoaded) {
        // Data loading failed, stop initialization
        return; 
    }

    // 2. Setup Listeners
    filterForm.addEventListener('submit', filterDSOs);
    resetButton.addEventListener('click', resetFilters);
    
    // 3. Populate filters and display all data initially
    populateFilters();
    renderResults(ALL_DSO_DATA);
}

// Run initialization once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initFinder);


// LEARNING AND RESOURCE PAGE
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('celestial-cards-container');

    /**
     * Generates the HTML string for a single celestial object card.
     * @param {object} object - The celestial object data.
     * @returns {string} The HTML string for the card.
     */
    function createCardHTML(object) {
        const factList = object.facts.map(fact => `
            <li>${fact}</li>
        `).join('');

        // We include the object ID in the header title for clarity, matching the original format.
        const titleText = `${object.name} (${object.id})`;

        return `
            <div class="card" data-id="${object.id}">
                <div class="card-image">
                    <img src="${object.image_url}" alt="${object.image_text}" loading="lazy" width=350 height=300>
                </div>
                <div class="card-content">
                    <h3>${titleText}</h3>
                    <p><span class="fact-label">Distance:</span> ${object.distance}</p>
                    <p><span class="fact-label">Gases Present:</span> ${object.gases}</p>
                    <ul class="fact-list">
                        ${factList}
                    </ul>
                </div>
            </div>
        `;
    }

    /**
     * Fetches the JSON data and renders the cards.
     */
    async function loadCelestialObjects() {
        // The JSON file must be available at this path for the fetch to succeed
        const jsonPath = 'file/planets.json';
        
        try {
            const response = await fetch(jsonPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const objects = await response.json();
            
            // Clear the loading indicator
            container.innerHTML = ''; 

            // Render all cards
            const cardsHTML = objects.map(createCardHTML).join('');
            container.innerHTML = cardsHTML;

        } catch (error) {
            console.error('Failed to load celestial objects:', error);
            container.innerHTML = `
                <div class="loading-container" style="color: #f87171;">
                    <p>Error loading catalog data: ${error.message}. Please check the JSON file path and ensure it's correct.</p>
                </div>
            `;
        }
    }

    loadCelestialObjects();
});


// HAMBURGER MENU
const menuToggle = document.getElementById('menu-toggle');
const mainMenu = document.getElementById('main-menu');
const factToggleButton = document.getElementById('toggle-facts-btn');

// --- Responsive Menu Toggle ---
menuToggle.addEventListener('click', () => {
    const isExpanded = mainMenu.classList.toggle('nav-open');
    menuToggle.setAttribute('aria-expanded', isExpanded);
});
