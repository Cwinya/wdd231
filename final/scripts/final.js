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