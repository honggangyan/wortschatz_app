/**
 * German Vocabulary Learning Application
 * 
 * This application helps users learn German vocabulary by:
 * 1. Looking up words through an API
 * 2. Displaying word details with meanings and examples
 * 3. Providing interactive UI with visual feedback
 * 4. Handling errors gracefully
 */

// ===== Configuration =====
// Store all app-wide settings in one place for easy management
const APP = {
  config: {
    // Animation timings (in milliseconds)
    animation: {
      duration: 200  // How long the button animation lasts
    },
    
    // DOM element IDs - helps us find elements in the HTML
    elements: {
      searchBtn: 'search-btn',      // The search button
      searchInput: 'search-input',  // The input field
      results: 'word-details-container'  // Where results are displayed
    }
  }
};

/**
 * Main Application Class
 * This class handles all the app's functionality in an organized way
 */
class VocabApp {
  /**
   * Set up the application when it starts
   * - Find all needed HTML elements
   * - Set up event listeners
   */
  constructor() {
    // First, get all the HTML elements we need
    this.setupElements();
    // Then, set up our event listeners
    this.setupEventListeners();
  }

  /**
   * Find and store references to all needed HTML elements
   * This makes our code faster and more reliable
   */
  setupElements() {
    const { elements } = APP.config;
    
    // Store references to frequently used elements
    this.btn = document.getElementById(elements.searchBtn);
    this.input = document.getElementById(elements.searchInput);
    this.results = document.getElementById(elements.results);

    // Make sure we found all elements
    if (!this.btn || !this.input || !this.results) {
      throw new Error('Could not find all required HTML elements');
    }
  }

  /**
   * Set up all event listeners for user interactions
   * This is where we respond to user actions like clicks and key presses
   */
  setupEventListeners() {
    // When search button is clicked
    this.btn.addEventListener('click', () => this.handleSearch());

    // When Enter key is pressed in the input field
    this.input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();  // Prevent form submission
        this.handleSearch(event);
      }
    });
  }

  /**
   * Handle the search process
   * This is the main function that:
   * 1. Gets the word from input
   * 2. Shows button animation
   * 3. Fetches word details
   * 4. Displays results
   */
  async handleSearch(event) {
    try {
      // Get the word and remove extra spaces
      const word = this.input.value.trim();
      if (!word) return;  // Don't search if input is empty

      // 只在按回车键时才触发动画
      if (event && event.type === 'keypress') {
        this.animateButton();
      }

      // Get word details from the API
      const data = await this.fetchWordDetails(word);

      // Show the results
      this.displayResults(data);
    } catch (error) {
      // If anything goes wrong, show the error
      console.error('Search failed:', error);
      this.showError(error.message);
    }
  }

  /**
   * Get word details from the server
   * Makes an API request to get information about the word
   */
  async fetchWordDetails(word) {
    const response = await fetch('/api/getWordDetails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word })
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Could not fetch word details');
    }

    return response.json();  // Parse the JSON response
  }

  /**
   * Display the word details in the UI
   * Takes the API response and creates HTML to show it
   */
  displayResults(data) {
    // Show a message if no word data was found
    if (!data?.Word) {
      this.results.innerHTML = '<h3 class="subtitle">Happy learning!!!</h3>';
      return;
    }

    // Create and display the HTML for word details
    const html = `
      <div class="word-details">
        <h3>${this.escape(data.Word)}</h3>
        <p>Part of Speech: ${this.escape(data.Part_of_speech)}</p>
        ${this.getNounDetails(data)}
        ${this.getMeanings(data)}
      </div>
    `;

    this.results.innerHTML = html;
  }

  /**
   * Create HTML for noun-specific information
   * Only shown if the word is a noun
   */
  getNounDetails(data) {
    // Only show gender and plural for nouns
    if (data.Part_of_speech.toLowerCase() !== 'noun') return '';
    
    return `
      <p>Gender: ${this.escape(data.Gender)}</p>
      <p>Plural: ${this.escape(data.Plural)}</p>
    `;
  }

  /**
   * Creates HTML for the word meanings section
   * @param {Object} data - Object containing word details
   * @param {Array} data.Meanings - Array of meanings, each containing Meaning, Example, and Translation
   * @returns {string} Formatted HTML string
   */
  getMeanings(data) {
    // Map through all meanings to create list items
    const meanings = data.Meanings.map(meaning => `
      <li>
        <!-- Display German meaning -->
        <strong>${this.escape(meaning.Meaning)}</strong><br>
        <!-- Display German example sentence -->
        ${this.escape(meaning.Example)}<br>
        <!-- Display English translation in italics -->
        <em>${this.escape(meaning.Translation)}</em>
      </li>
    `).join('');  // Join all list items into a single string

    // Return complete meanings section HTML with heading and ordered list
    return `<h4>Meanings:</h4><ol>${meanings}</ol>`;
  }

  /**
   * Handle button animation
   * Provides visual feedback when searching
   */
  animateButton() {
    // Add the pressed effect
    this.btn.classList.add('pressed');
    
    // Remove the effect after animation duration
    setTimeout(() => {
      this.btn.classList.remove('pressed');
    }, APP.config.animation.duration);
  }

  /**
   * Show error message to user
   * Displays errors in a user-friendly way
   */
  showError(message) {
    this.results.innerHTML = `
      <div class="error-message">
        <p>Error: ${this.escape(message)}</p>
      </div>
    `;
  }

  /**
   * Make text safe for HTML
   * Prevents XSS attacks by escaping special characters
   */
  escape(text) {
    const safeCharacters = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, char => safeCharacters[char]);
  }
}

// Start the application when the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    new VocabApp();
    console.log('Application started successfully');
  } catch (error) {
    console.error('Failed to start application:', error);
  }
});
