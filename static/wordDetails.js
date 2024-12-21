// wordDetails.js - Main JavaScript file for the German vocabulary learning app

// =============== CONSTANTS & DATA STRUCTURES ===============
// Define timing constants for button animations
const ANIMATION_TIMINGS = {
  HOVER_TO_PRESS: 50,   // Time (in ms) between hover and press effects
  TOTAL_ANIMATION: 200  // Total duration (in ms) of the animation
};

// Example data structure showing the expected format of word details
// This helps understand how the data should be structured
const EXAMPLE_WORD = {
  Word: "Schloss",              // The German word
  Part_of_speech: "Noun",       // Word type (noun, verb, etc.)
  Gender: "Das Schloss",        // Article + word (for nouns only)
  Plural: "Schlösser",          // Plural form (for nouns only)
  Meanings: [                   // Array of meaning objects
    {
      Meaning: "Castle",                                    // English translation
      Example: "Das Schloss auf dem Hügel ist sehr alt.",  // Example in German
      Translation: "The castle on the hill is very old.",   // Example translation
    },
    // Additional meanings...
  ],
};

// =============== HTML GENERATION FUNCTIONS ===============
/**
 * Main function to generate HTML for word details
 * @param {Object} data - Word data object containing all word information
 * @returns {string} HTML string to be inserted into the page
 */
function parseWordDetails(data) {
  // Check if we have valid data
  if (!data || !data.Word) {
    return '<h3 class="subtitle">Happy learning!!!</h3>';
  }

  // Break down HTML generation into smaller, focused functions
  const mainContent = generateMainContent(data);
  const nounSpecificContent = generateNounContent(data);
  const meaningsContent = generateMeaningsContent(data);

  // Combine all parts into final HTML structure
  return `
    <div class="word-details">
      ${mainContent}
      ${nounSpecificContent}
      ${meaningsContent}
    </div>
  `;
}

/**
 * Generates HTML for the main word information
 * @param {Object} data - Word data object
 * @returns {string} HTML string for main content
 */
function generateMainContent(data) {
  return `
    <h3>${data.Word}</h3>
    <p>Part of Speech: ${data.Part_of_speech}</p>
  `;
}

/**
 * Generates HTML for noun-specific information (gender and plural)
 * Only generates content if the word is a noun
 * @param {Object} data - Word data object
 * @returns {string} HTML string for noun content or empty string
 */
function generateNounContent(data) {
  // Early return if not a noun
  if (data.Part_of_speech.toLowerCase() !== "noun") return '';
  
  return `
    <p>Gender: ${data.Gender}</p>
    <p>Plural: ${data.Plural}</p>
  `;
}

/**
 * Generates HTML for word meanings, examples, and translations
 * @param {Object} data - Word data object
 * @returns {string} HTML string for meanings section
 */
function generateMeaningsContent(data) {
  // Use map to transform each meaning object into HTML
  // join('') combines all array elements into a single string
  const meaningsList = data.Meanings.map(meaning => `
    <li>
      <strong>${meaning.Meaning}</strong><br>
      ${meaning.Example}<br>
      <em>${meaning.Translation}</em>
    </li>
  `).join('');

  return `
    <h4>Meanings:</h4>
    <ol>${meaningsList}</ol>
  `;
}

// =============== ANIMATION FUNCTIONS ===============
/**
 * Handles button animation sequence
 * Creates a smooth transition effect when button is clicked
 * @param {HTMLElement} button - The button element to animate
 */
function animateButton(button) {
  // Step 1: Add hover effect (scale up)
  button.classList.add('hover-effect');
  
  // Step 2: Add pressed effect (scale down) after delay
  // setTimeout schedules code to run after a delay
  setTimeout(() => {
    button.classList.add('pressed');
    
    // Step 3: Remove all effects after animation duration
    // Nested setTimeout for cleanup
    setTimeout(() => {
      button.classList.remove('pressed');
      button.classList.remove('hover-effect');
    }, ANIMATION_TIMINGS.TOTAL_ANIMATION);
  }, ANIMATION_TIMINGS.HOVER_TO_PRESS);
}

// =============== API FUNCTIONS ===============
/**
 * Makes API request to get word details from the server
 * @param {string} word - The word to look up
 * @returns {Promise<Object>} Promise that resolves to word details
 */
async function fetchWordDetails(word) {
  // fetch is a modern way to make HTTP requests
  const response = await fetch("/api/getWordDetails", {
    method: "POST",                              // HTTP method
    headers: {
      "Content-Type": "application/json",        // Tell server we're sending JSON
    },
    body: JSON.stringify({ word }),             // Convert data to JSON string
  });
  return await response.json();                 // Parse JSON response
}

// =============== EVENT HANDLERS ===============
/**
 * Sets up all event listeners for the application
 * This is called when the DOM is fully loaded
 */
function initializeEventListeners() {
  // Get references to DOM elements we need
  const searchButton = document.getElementById("search-btn");
  const searchInput = document.getElementById("search-input");

  // Define the search function that will be used for both button click and enter key
  const performSearch = async () => {
    animateButton(searchButton);                    // Animate the button
    const word = searchInput.value;                 // Get input value
    const wordData = await fetchWordDetails(word);  // Get word data from API
    // Update the page with new word details
    document.getElementById("word-details-container").innerHTML =
      parseWordDetails(wordData);
  };

  // Add click event listener to search button
  searchButton.addEventListener("click", performSearch);

  // Add keypress event listener to input field
  searchInput.addEventListener("keypress", (event) => {
    // Check if the pressed key was Enter
    if (event.key === "Enter") {
      event.preventDefault();  // Prevent form submission
      performSearch();         // Perform the search
    }
  });
}

// =============== INITIALIZATION ===============
// Wait for DOM to be fully loaded before setting up event listeners
document.addEventListener("DOMContentLoaded", initializeEventListeners);
