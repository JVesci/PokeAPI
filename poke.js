document.addEventListener('DOMContentLoaded', () => {
  // 1. Selecting necessary DOM elements for interaction.
  const form = document.querySelector('form');  // Form element for submitting the search query
  const input = document.querySelector('input');  // Input field where the user enters the Pokémon name
  const result = document.getElementById('result');  // Where the fetched data will be displayed
  const button = document.querySelector('button');  // Button to trigger the search

  // Helper function to convert string to Title Case
  const toTitleCase = str =>
    str.toLowerCase().split(' ').filter(Boolean).map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

  // 2. Event listener for the form submission
  form.addEventListener('submit', async e => {
    e.preventDefault();  // Prevents the default form submission behavior
    await searchPokemon();  // Trigger the search function when the form is submitted
  });

  // 3. Event listener for the button click
  button.addEventListener('click', async () => {
    await searchPokemon();  // Trigger the search function when the button is clicked
  });

  // 4. The function that fetches Pokémon data from the PokeAPI
  async function searchPokemon() {
    // Get the Pokémon name from the input field, and convert it to lowercase
    const name = input.value.trim().toLowerCase();

    // Setting up a timeout controller for the request (3 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);  // Abort the request after 3 seconds

    try {
      // Fetch the Pokémon data from the API using the name from the input field
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, { signal: controller.signal });
      clearTimeout(timeoutId);  // Clear the timeout once the request completes

      // If the response is not successful, throw an error
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      // Parse the response as JSON
      const data = await res.json();

      // 5. Display the Pokémon data in the DOM
      displayPokemon(data);  // Call the function to display the fetched Pokémon data
    } catch (err) {
      // 6. Basic error handling for timeout or failed fetch request
      alert(err.name === 'AbortError'
        ? 'Request timed out. Please try again.'  // Error message for timeout
        : 'Failed to fetch Pokémon data. Please check the name or ID.'  // Generic error message for other issues
      );
    }
  }

  // 7. Function that takes the fetched data and updates the DOM
  function displayPokemon(data) {
    const { name, id, height, weight, base_experience, abilities, types, stats, sprites } = data;

    // Dynamically create HTML content and insert it into the result div
    result.innerHTML = `
      <!-- Background image using official artwork -->
      <div class="pokemon-background" style="background-image: url('${sprites.other['official-artwork'].front_default}')">
        <div class="card">
          <!-- Displaying the front image of the Pokémon -->
          <img src="${sprites.front_default}" alt="${name}" class="pokemon-img">
          <h1>${toTitleCase(name)}</h1>  <!-- Display the Pokémon name in title case -->

          <h2>Details</h2>
          <table>
            <tr><td>Species</td><td>${toTitleCase(name)}</td></tr>  <!-- Display the species name -->
            <tr><td>ID</td><td>${id}</td></tr>  <!-- Display the Pokémon's ID -->
            <tr><td>Height</td><td>${height}</td></tr>  <!-- Display the Pokémon's height -->
            <tr><td>Weight</td><td>${weight}</td></tr>  <!-- Display the Pokémon's weight -->
            <tr><td>Base Experience</td><td>${base_experience}</td></tr>  <!-- Display base experience -->
            <tr><td>Abilities</td><td>${abilities.map(a => a.ability.name).join(', ')}</td></tr>  <!-- Display abilities -->
            <tr><td>Type</td><td>${types.map(t => t.type.name).join(', ')}</td></tr>  <!-- Display types -->
          </table>

          <h2>Stats</h2>
          <table>
            <!-- Dynamically create rows for Pokémon stats -->
            ${stats.map(s => `<tr><td>${s.stat.name}</td><td>${s.base_stat}</td></tr>`).join('')}
          </table>
        </div>
      </div>
    `;
  }
});