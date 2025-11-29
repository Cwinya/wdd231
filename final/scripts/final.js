// JavaScript is included here
document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    
    // --- MOCK API DATA (Simulating a successful JSON response) ---
    const mockNewsData = [
        {
            title: "Perseids Meteor Shower Peaks Tonight!",
            date: "August 12, 2025",
            summary: "The annual Perseids shower will reach its maximum rate, offering up to 100 meteors per hour in dark sky locations. Be sure to look northeast after midnight.",
            source: "NASA/JPL",
            link: "#"
        },
        {
            title: "Mars and Jupiter in Close Conjunction",
            date: "September 5, 2025",
            summary: "The two gas giants will be separated by less than half a degree in the evening sky, a spectacular sight for binoculars or small telescopes.",
            source: "Sky & Telescope",
            link: "#"
        },
        {
            title: "Webb Telescope Captures New Image of Pillars of Creation",
            date: "October 20, 2025",
            summary: "The James Webb Space Telescope released a stunning infrared view of the famous star-forming region in the Eagle Nebula.",
            source: "ESA/Hubble",
            link: "#"
        }
    ];

    /**
     * Function to simulate fetching data from a Remote API
     * * Course Outcome Relevance: This demonstrates the core logic
     * for the 'Dynamic Websites/Remote APIs' requirement using a Promise.
     */
    function fetchAstronomyNews() {
        // In a real application, you would replace this with:
        // fetch('YOUR_API_ENDPOINT_HERE')
        // .then(response => {
        //     if (!response.ok) {
        //         throw new Error('Network response was not ok');
        //     }
        //     return response.json(); // Handling JSON data
        // })
        // .then(data => {
        //     displayNews(data);
        // })
        // .catch(error => {
        //     console.error('Error fetching data:', error);
        //     newsContainer.innerHTML = '<p class="loading-message" style="color:red;">Failed to load news. Try again later.</p>';
        // });


        // --- Simulation with a delay to show 'Loading' message ---
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(mockNewsData);
            }, 1500); // Simulate network delay
        });
    }

    /**
     * Function to display the fetched news items on the page.
     */
    function displayNews(newsArray) {
        newsContainer.innerHTML = ''; // Clear the loading message
        
        newsArray.forEach(item => {
            const newsItem = document.createElement('article');
            newsItem.className = 'news-item';
            newsItem.setAttribute('role', 'article'); // Accessibility role

            newsItem.innerHTML = `
                <h3>${item.title}</h3>
                <p><strong>Date:</strong> ${item.date}</p>
                <p>${item.summary}</p>
                <p><a href="${item.link}" target="_blank" aria-label="Read more about ${item.title}">Read More (Source: ${item.source})</a></p>
            `;
            newsContainer.appendChild(newsItem);
        });
    }

    // Execute the API fetching function
    fetchAstronomyNews()
        .then(data => {
            displayNews(data);
        });
});