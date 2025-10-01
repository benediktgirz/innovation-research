// Radl Wetter - Cycling Weather App
class RadlWetter {
  constructor() {
    this.currentRadius = 50;
    this.lang = this.detectLanguage();
    this.translations = this.getTranslations();
    this.map = null;
    this.preferences = this.loadPreferences();
    this.init();
  }

  detectLanguage() {
    // Detect language from page HTML lang attribute
    return document.documentElement.lang || 'de';
  }

  getTranslations() {
    const translations = {
      de: {
        geocodingError: 'Orte konnten nicht gefunden werden. Bitte überprüfen Sie die Schreibweise.',
        weatherError: 'Fehler beim Laden der Wetterdaten. Bitte versuchen Sie es später erneut.',
        missingInputs: 'Bitte geben Sie sowohl Start- als auch Zielort ein.',
        missingStart: 'Bitte geben Sie zuerst einen Startort ein.',
        startNotFound: 'Startort konnte nicht gefunden werden.',
        noDestinations: 'Keine Zielorte im {radius} KM Radius gefunden.',
        noSunnyDestinations: 'Keine sonnigen Zielorte im gewählten Radius gefunden.',
        suggestionError: 'Fehler beim Vorschlagen eines Zielorts.',
        weatherLoadError: 'Wetterdaten konnten nicht geladen werden.',
        poorWeatherWarning: '⚠️ Keine guten Radfahrbedingungen am Zielort. Wählen Sie ein anderes Ziel.',
        noIdealTimes: 'Keine idealen Zeiten',
        routeWarningRain: '⚠️ Regenrisiko auf der Strecke zwischen Start und Ziel.',
        routeWarningCold: '⚠️ Niedrige Temperaturen (<10°C) auf der Strecke erwartet.',
        routeWarningRainAndCold: '⚠️ Regen und niedrige Temperaturen auf der Strecke erwartet.',
        routeWeatherGood: '✅ Gute Wetterbedingungen auf der gesamten Strecke.',
        routeWeatherCheckFailed: 'Strecken-Wetterprüfung fehlgeschlagen.',
        noIdealCyclingTimes: 'Keine idealen Radfahrzeiten',
        whyNotIdeal: 'Warum nicht ideal:',
        tooCold: 'Zu kalt (<{temp}°C).',
        tooWindy: 'Zu windig (>{wind} km/h).',
        tooMuchRain: 'Zu viel Regen (>{rain}mm).',
        idealCyclingTimes: 'Ideale Radfahrzeiten:'
      },
      en: {
        geocodingError: 'Locations could not be found. Please check the spelling.',
        weatherError: 'Error loading weather data. Please try again later.',
        missingInputs: 'Please enter both start and destination locations.',
        missingStart: 'Please enter a start location first.',
        startNotFound: 'Start location could not be found.',
        noDestinations: 'No destinations found within {radius} KM radius.',
        noSunnyDestinations: 'No sunny destinations found in the selected radius.',
        suggestionError: 'Error suggesting a destination.',
        weatherLoadError: 'Weather data could not be loaded.',
        poorWeatherWarning: '⚠️ Poor cycling conditions at destination. Choose a different destination.',
        noIdealTimes: 'No ideal times',
        routeWarningRain: '⚠️ Risk of rain along the route between start and destination.',
        routeWarningCold: '⚠️ Low temperatures (<10°C) expected along the route.',
        routeWarningRainAndCold: '⚠️ Rain and low temperatures expected along the route.',
        routeWeatherGood: '✅ Good weather conditions along the entire route.',
        routeWeatherCheckFailed: 'Route weather check failed.',
        noIdealCyclingTimes: 'No ideal cycling times',
        whyNotIdeal: 'Why not ideal:',
        tooCold: 'Too cold (<{temp}°C).',
        tooWindy: 'Too windy (>{wind} km/h).',
        tooMuchRain: 'Too much rain (>{rain}mm).',
        idealCyclingTimes: 'Ideal cycling times:'
      },
      fr: {
        geocodingError: 'Les lieux n\'ont pas pu être trouvés. Veuillez vérifier l\'orthographe.',
        weatherError: 'Erreur lors du chargement des données météo. Veuillez réessayer plus tard.',
        missingInputs: 'Veuillez saisir les lieux de départ et de destination.',
        missingStart: 'Veuillez d\'abord saisir un lieu de départ.',
        startNotFound: 'Le lieu de départ n\'a pas pu être trouvé.',
        noDestinations: 'Aucune destination trouvée dans un rayon de {radius} KM.',
        noSunnyDestinations: 'Aucune destination ensoleillée trouvée dans le rayon sélectionné.',
        suggestionError: 'Erreur lors de la suggestion d\'une destination.',
        weatherLoadError: 'Les données météo n\'ont pas pu être chargées.',
        poorWeatherWarning: '⚠️ Mauvaises conditions de cyclisme à destination. Choisissez une autre destination.',
        noIdealTimes: 'Aucun moment idéal',
        routeWarningRain: '⚠️ Risque de pluie sur l\'itinéraire entre le départ et la destination.',
        routeWarningCold: '⚠️ Basses températures (<10°C) attendues sur l\'itinéraire.',
        routeWarningRainAndCold: '⚠️ Pluie et basses températures attendues sur l\'itinéraire.',
        routeWeatherGood: '✅ Bonnes conditions météorologiques sur tout l\'itinéraire.',
        routeWeatherCheckFailed: 'Vérification météo de l\'itinéraire échouée.',
        noIdealCyclingTimes: 'Aucun moment idéal pour le cyclisme',
        whyNotIdeal: 'Pourquoi pas idéal:',
        tooCold: 'Trop froid (<{temp}°C).',
        tooWindy: 'Trop venteux (>{wind} km/h).',
        tooMuchRain: 'Trop de pluie (>{rain}mm).',
        idealCyclingTimes: 'Moments idéaux pour le cyclisme:'
      }
    };
    return translations[this.lang] || translations.de;
  }

  t(key, replacements = {}) {
    let text = this.translations[key] || key;
    Object.keys(replacements).forEach(placeholder => {
      text = text.replace(`{${placeholder}}`, replacements[placeholder]);
    });
    return text;
  }

  init() {
    this.bindEvents();
    this.setupModal();
    this.setupAutocomplete();
  }

  bindEvents() {
    // Main search button
    document.getElementById('searchWeather')?.addEventListener('click', () => {
      this.searchWeather();
    });

    // Suggest destination button
    document.getElementById('suggestDestination')?.addEventListener('click', () => {
      this.suggestSunniestDestination();
    });

    // Radius button
    document.getElementById('radiusButton')?.addEventListener('click', () => {
      this.showRadiusModal();
    });

    // Reset destination button
    document.getElementById('resetDestination')?.addEventListener('click', () => {
      this.resetDestination();
    });

    // Settings button
    document.getElementById('settingsButton')?.addEventListener('click', () => {
      this.showSettingsModal();
    });

    // Settings link from metrics
    document.getElementById('settingsLinkFromMetrics')?.addEventListener('click', () => {
      this.showSettingsModal();
    });

    // Enter key support for inputs
    ['startLocation', 'destinationLocation'].forEach(id => {
      document.getElementById(id)?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.searchWeather();
      });
    });
  }

  setupModal() {
    const modal = document.getElementById('radiusModal');
    const slider = document.getElementById('radiusSlider');
    const valueDisplay = document.getElementById('radiusValue');
    const cancelBtn = document.getElementById('cancelRadius');
    const confirmBtn = document.getElementById('confirmRadius');

    // Slider updates
    slider?.addEventListener('input', (e) => {
      valueDisplay.textContent = `${e.target.value} KM`;
    });

    // Modal controls
    cancelBtn?.addEventListener('click', () => this.hideRadiusModal());
    confirmBtn?.addEventListener('click', () => this.confirmRadius());

    // Click outside to close
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) this.hideRadiusModal();
    });
  }

  showRadiusModal() {
    const modal = document.getElementById('radiusModal');
    const slider = document.getElementById('radiusSlider');
    slider.value = this.currentRadius;
    document.getElementById('radiusValue').textContent = `${this.currentRadius} KM`;
    modal.classList.remove('hidden');
  }

  hideRadiusModal() {
    document.getElementById('radiusModal').classList.add('hidden');
  }

  confirmRadius() {
    const newRadius = document.getElementById('radiusSlider').value;
    this.currentRadius = parseInt(newRadius);
    document.getElementById('radiusButton').textContent = `📍 ${this.currentRadius} KM`;
    this.hideRadiusModal();
  }

  resetDestination() {
    // Clear destination input
    document.getElementById('destinationLocation').value = '';
    
    // Reset radius to default
    this.currentRadius = 50;
    document.getElementById('radiusButton').textContent = '📍 50 KM';
    document.getElementById('radiusSlider').value = 50;
    document.getElementById('radiusValue').textContent = '50 KM';
    
    // Hide weather results
    document.getElementById('weatherResults')?.classList.add('hidden');
    document.getElementById('errorMessage')?.classList.add('hidden');
    
    // Clear autocomplete dropdowns
    const autocompleteDropdowns = document.querySelectorAll('.autocomplete-dropdown');
    autocompleteDropdowns.forEach(dropdown => {
      dropdown.style.display = 'none';
    });

    console.log('Destination configuration reset');
  }

  setupAutocomplete() {
    // Setup autocomplete for both location inputs
    this.setupLocationAutocomplete('startLocation');
    this.setupLocationAutocomplete('destinationLocation');
  }

  setupLocationAutocomplete(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    // Create autocomplete container
    const container = document.createElement('div');
    container.className = 'autocomplete-container';
    container.style.position = 'relative';
    
    // Wrap the input
    input.parentNode.insertBefore(container, input);
    container.appendChild(input);

    // Create suggestions dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown';
    dropdown.id = `${inputId}-dropdown`;
    dropdown.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 0.375rem 0.375rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      max-height: 300px;
      overflow-y: auto;
      z-index: 1000;
      display: none;
    `;
    container.appendChild(dropdown);

    let searchTimeout;
    let currentSuggestions = [];
    let selectedIndex = -1;

    // Input event listener
    input.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      
      if (query.length < 2) {
        this.hideAutocomplete(dropdown);
        return;
      }

      // Debounce the search
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.searchLocations(query, dropdown, inputId);
      }, 300);
    });

    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
      const items = dropdown.querySelectorAll('.autocomplete-item');
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
          this.updateSelection(items, selectedIndex);
          break;
        case 'ArrowUp':
          e.preventDefault();
          selectedIndex = Math.max(selectedIndex - 1, -1);
          this.updateSelection(items, selectedIndex);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && items[selectedIndex] && dropdown.currentSuggestions) {
            this.selectSuggestion(input, dropdown, dropdown.currentSuggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          this.hideAutocomplete(dropdown);
          selectedIndex = -1;
          break;
      }
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        this.hideAutocomplete(dropdown);
        selectedIndex = -1;
      }
    });
  }

  async searchLocations(query, dropdown, inputId) {
    try {
      // Use Nominatim for autocomplete suggestions
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=de&limit=8&addressdetails=1`
      );

      if (!response.ok) return;

      const suggestions = await response.json();
      // Store suggestions on the dropdown element for keyboard navigation
      dropdown.currentSuggestions = suggestions;
      this.displaySuggestions(suggestions, dropdown, inputId);
    } catch (error) {
      console.error('Autocomplete search error:', error);
    }
  }

  displaySuggestions(suggestions, dropdown, inputId) {
    dropdown.innerHTML = '';
    
    if (suggestions.length === 0) {
      this.hideAutocomplete(dropdown);
      return;
    }

    suggestions.forEach((suggestion, index) => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.style.cssText = `
        padding: 0.75rem;
        cursor: pointer;
        border-bottom: 1px solid #f3f4f6;
        transition: background-color 0.15s ease;
      `;
      
      // Format the display name
      const parts = suggestion.display_name.split(',');
      const mainName = parts[0];
      const details = parts.slice(1, 3).join(',');
      
      item.innerHTML = `
        <div style="font-weight: 500; color: #1f2937;">${mainName}</div>
        <div style="font-size: 0.875rem; color: #6b7280;">${details}</div>
      `;

      // Hover effects
      item.addEventListener('mouseenter', () => {
        item.style.backgroundColor = '#f9fafb';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.backgroundColor = 'white';
      });

      // Click handler
      item.addEventListener('click', () => {
        this.selectSuggestion(document.getElementById(inputId), dropdown, suggestion);
      });

      dropdown.appendChild(item);
    });

    this.showAutocomplete(dropdown);
  }

  selectSuggestion(input, dropdown, suggestion) {
    // Use the main name (first part before comma)
    const mainName = suggestion.display_name.split(',')[0];
    input.value = mainName;
    this.hideAutocomplete(dropdown);
    
    // Store the full suggestion data for later use
    input.dataset.lat = suggestion.lat;
    input.dataset.lon = suggestion.lon;
    input.dataset.fullName = suggestion.display_name;
  }

  updateSelection(items, selectedIndex) {
    items.forEach((item, index) => {
      if (index === selectedIndex) {
        item.style.backgroundColor = '#dbeafe';
      } else {
        item.style.backgroundColor = 'white';
      }
    });
  }

  showAutocomplete(dropdown) {
    dropdown.style.display = 'block';
  }

  hideAutocomplete(dropdown) {
    dropdown.style.display = 'none';
  }

  initializeMap(startCoords, destinationCoords) {
    const mapContainer = document.getElementById('routeMap');
    if (!mapContainer) {
      console.error('Map container not found');
      return;
    }

    // Check if Leaflet is available
    if (typeof L === 'undefined') {
      console.error('Leaflet not loaded yet, retrying in 500ms...');
      setTimeout(() => this.initializeMap(startCoords, destinationCoords), 500);
      return;
    }

    try {
      // Clear the loading message
      mapContainer.innerHTML = '';

      // Clear existing map
      if (this.map) {
        this.map.remove();
      }

      // Calculate center point between start and destination
      const centerLat = (startCoords.lat + destinationCoords.lat) / 2;
      const centerLon = (startCoords.lon + destinationCoords.lon) / 2;

      // Calculate distance to determine appropriate zoom level
      const distance = this.calculateDistance(startCoords.lat, startCoords.lon, destinationCoords.lat, destinationCoords.lon);
      console.log(`Distance between locations: ${distance.toFixed(2)} km`);
      
      let zoomLevel;
      if (distance < 5) zoomLevel = 17;        // Very close locations - street level
      else if (distance < 15) zoomLevel = 15;  // Close locations - neighborhood  
      else if (distance < 30) zoomLevel = 13;  // Medium distance - city level
      else if (distance < 60) zoomLevel = 11;  // Far locations - regional
      else if (distance < 150) zoomLevel = 9;  // Long distance - state/province
      else zoomLevel = 7;                      // Very long distance - country
      
      console.log(`Calculated zoom level: ${zoomLevel} for distance ${distance.toFixed(2)} km`);

      // Initialize map with calculated zoom level
      this.map = L.map('routeMap').setView([centerLat, centerLon], zoomLevel);
      
      // Alternative: Use fitBounds for better automatic zoom
      const bounds = L.latLngBounds([
        [startCoords.lat, startCoords.lon],
        [destinationCoords.lat, destinationCoords.lon]
      ]);
      
      // Add padding and fit bounds after a short delay to ensure map is ready
      setTimeout(() => {
        this.map.fitBounds(bounds, { 
          padding: [20, 20], 
          maxZoom: Math.min(zoomLevel + 2, 16) // Ensure we don't zoom too far out
        });
      }, 500);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(this.map);

      // Add markers for start and destination
      const startMarker = L.marker([startCoords.lat, startCoords.lon])
        .addTo(this.map)
        .bindPopup(`📍 ${startCoords.display_name || 'Start'}`);

      const destinationMarker = L.marker([destinationCoords.lat, destinationCoords.lon])
        .addTo(this.map)
        .bindPopup(`🏁 ${destinationCoords.display_name || 'Destination'}`);

      // Add a simple line between start and destination
      const routeLine = L.polyline([
        [startCoords.lat, startCoords.lon],
        [destinationCoords.lat, destinationCoords.lon]
      ], { color: '#3b82f6', weight: 4, opacity: 0.7 }).addTo(this.map);

      // Fit map to show both markers with padding
      const group = new L.featureGroup([startMarker, destinationMarker]);
      this.map.fitBounds(group.getBounds().pad(0.1));

      // Force map to invalidate size after a short delay
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 250);

      console.log('Map initialized successfully');
      return { startMarker, destinationMarker, routeLine };

    } catch (error) {
      console.error('Map initialization error:', error);
      mapContainer.innerHTML = `
        <div class="absolute inset-0 flex items-center justify-center text-red-500">
          <div class="text-center">
            <p>Map loading failed</p>
            <button onclick="location.reload()" class="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm">
              Retry
            </button>
          </div>
        </div>
      `;
    }
  }

  async checkRouteWeather(startCoords, destinationCoords) {
    try {
      // Generate intermediate points along the route
      const intermediatePoints = this.generateIntermediatePoints(startCoords, destinationCoords, 3);
      
      // Get weather for intermediate points
      const weatherPromises = intermediatePoints.map(point => 
        this.getWeatherData(point.lat, point.lon)
      );

      const weatherResults = await Promise.all(weatherPromises);
      
      // Check for bad weather conditions
      const routeWarnings = this.analyzeRouteWeather(weatherResults, intermediatePoints);
      
      this.displayRouteWarnings(routeWarnings);
      
      return routeWarnings;
    } catch (error) {
      console.error('Route weather check error:', error);
      return { hasWarnings: false, message: this.t('routeWeatherCheckFailed') };
    }
  }

  generateIntermediatePoints(start, destination, numPoints) {
    const points = [];
    
    for (let i = 1; i <= numPoints; i++) {
      const ratio = i / (numPoints + 1);
      const lat = start.lat + (destination.lat - start.lat) * ratio;
      const lon = start.lon + (destination.lon - start.lon) * ratio;
      
      points.push({ lat, lon, ratio });
    }
    
    return points;
  }

  analyzeRouteWeather(weatherResults, points) {
    const warnings = [];
    let hasRain = false;
    let hasColdWeather = false;
    
    weatherResults.forEach((weather, index) => {
      if (!weather || weather.length === 0) return;
      
      // Check each day's weather
      weather.forEach(day => {
        // Check for rain using user preference
        if (day.precipitation > this.preferences.maxPrecipitation) {
          hasRain = true;
        }
        
        // Check for cold weather using user preference
        if (day.temperature < this.preferences.minTemperature) {
          hasColdWeather = true;
        }
      });
    });
    
    if (hasRain || hasColdWeather) {
      let warningText = '';
      
      if (hasRain && hasColdWeather) {
        warningText = this.t('routeWarningRainAndCold');
      } else if (hasRain) {
        warningText = this.t('routeWarningRain');
      } else if (hasColdWeather) {
        warningText = this.t('routeWarningCold');
      }
      
      return {
        hasWarnings: true,
        message: warningText,
        type: 'warning'
      };
    } else {
      return {
        hasWarnings: false,
        message: this.t('routeWeatherGood'),
        type: 'success'
      };
    }
  }

  displayRouteWarnings(warnings) {
    const warningContainer = document.getElementById('routeWeatherWarning');
    if (!warningContainer) return;
    
    warningContainer.innerHTML = '';
    warningContainer.classList.remove('hidden');
    
    const alertClass = warnings.hasWarnings ? 
      'bg-yellow-50 border border-yellow-200 text-yellow-800' : 
      'bg-green-50 border border-green-200 text-green-800';
    
    const icon = warnings.hasWarnings ? '⚠️' : '✅';
    
    warningContainer.innerHTML = `
      <div class="${alertClass} rounded-md p-3">
        <div class="flex">
          <div class="flex-shrink-0">
            <span class="text-lg">${icon}</span>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium">${warnings.message}</p>
          </div>
        </div>
      </div>
    `;
  }

  async searchWeather() {
    const startLocation = document.getElementById('startLocation').value.trim();
    const destinationLocation = document.getElementById('destinationLocation').value.trim();

    if (!startLocation || !destinationLocation) {
      this.showError(this.t('missingInputs'));
      return;
    }

    this.showLoading(true);
    this.hideError();

    try {
      // Geocode both locations
      const startCoords = await this.geocodeLocation(startLocation);
      const destinationCoords = await this.geocodeLocation(destinationLocation);

      if (!startCoords || !destinationCoords) {
        throw new Error(this.t('geocodingError'));
      }

      // Get weather data for both locations
      const [startWeather, destinationWeather] = await Promise.all([
        this.getWeatherData(startCoords.lat, startCoords.lon),
        this.getWeatherData(destinationCoords.lat, destinationCoords.lon)
      ]);

      // Initialize map with route
      this.initializeMap(startCoords, destinationCoords);
      
      // Check route weather conditions
      await this.checkRouteWeather(startCoords, destinationCoords);

      // Display results
      this.displayWeatherResults({
        start: { name: startLocation, coords: startCoords, weather: startWeather },
        destination: { name: destinationLocation, coords: destinationCoords, weather: destinationWeather }
      });

    } catch (error) {
      console.error('Weather search error:', error);
      this.showError(error.message || this.t('weatherError'));
    } finally {
      this.showLoading(false);
    }
  }

  async suggestSunniestDestination() {
    const startLocation = document.getElementById('startLocation').value.trim();

    if (!startLocation) {
      this.showError(this.t('missingStart'));
      return;
    }

    this.showLoading(true);
    this.hideError();

    try {
      const startCoords = await this.geocodeLocation(startLocation);
      if (!startCoords) {
        throw new Error(this.t('startNotFound'));
      }

      // Get potential destinations within radius
      const destinations = await this.findDestinationsInRadius(startCoords, this.currentRadius);
      
      if (destinations.length === 0) {
        throw new Error(this.t('noDestinations', { radius: this.currentRadius }));
      }

      // Get weather for all destinations
      const weatherPromises = destinations.map(dest => 
        this.getWeatherData(dest.lat, dest.lon).then(weather => ({
          ...dest,
          weather
        }))
      );

      const destinationsWithWeather = await Promise.all(weatherPromises);

      // Find sunniest destination (excluding start location)
      const bestDestination = this.findSunniestDestination(destinationsWithWeather, startLocation);

      if (bestDestination) {
        document.getElementById('destinationLocation').value = bestDestination.name;
        // Automatically search weather for the suggested destination
        await this.searchWeather();
      } else {
        this.showError(this.t('noSunnyDestinations'));
      }

    } catch (error) {
      console.error('Destination suggestion error:', error);
      this.showError(error.message || this.t('suggestionError'));
    } finally {
      this.showLoading(false);
    }
  }

  async geocodeLocation(locationName) {
    try {
      // Using Nominatim (OpenStreetMap) geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&countrycodes=de&limit=1&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();
      
      if (data.length === 0) {
        return null;
      }

      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        display_name: data[0].display_name
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  async getWeatherData(lat, lon) {
    try {
      const today = new Date();
      const dates = [];
      
      // Get weather for next 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
      }

      const weatherPromises = dates.map(date =>
        fetch(`https://api.brightsky.dev/weather?lat=${lat}&lon=${lon}&date=${date}`)
          .then(response => {
            if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
            return response.json();
          })
      );

      const weatherDataArrays = await Promise.all(weatherPromises);
      
      // Combine all weather data
      const allWeatherData = weatherDataArrays.flatMap(data => data.weather || []);
      
      return this.processDailyWeather(allWeatherData);
    } catch (error) {
      console.error('Weather API error:', error);
      throw new Error(this.t('weatherLoadError'));
    }
  }

  processDailyWeather(weatherData) {
    // Group by day
    const dailyWeather = {};
    
    weatherData.forEach(hour => {
      if (!hour.timestamp) return;
      
      const date = hour.timestamp.split('T')[0];
      if (!dailyWeather[date]) {
        dailyWeather[date] = [];
      }
      dailyWeather[date].push(hour);
    });

    // Process each day
    const processedDays = [];
    
    Object.keys(dailyWeather).forEach(date => {
      const dayData = dailyWeather[date];
      const cyclingWindows = this.findCyclingWindows(dayData);
      const sunshineHours = this.calculateSunshineHours(dayData);
      const hasPerfectConditions = cyclingWindows.length > 0;
      
      processedDays.push({
        date,
        cyclingWindows,
        sunshineHours,
        hasPerfectConditions,
        avgTemp: this.calculateAverageTemp(dayData),
        avgWind: this.calculateAverageWind(dayData),
        precipitation: this.calculateTotalPrecipitation(dayData)
      });
    });

    return processedDays;
  }

  findCyclingWindows(dayData) {
    const windows = [];
    let currentWindow = null;

    dayData.forEach(hour => {
      const isPerfect = this.isPerfectCyclingCondition(hour);
      
      if (isPerfect) {
        if (!currentWindow) {
          currentWindow = {
            start: hour.timestamp,
            end: hour.timestamp,
            hours: [hour]
          };
        } else {
          currentWindow.end = hour.timestamp;
          currentWindow.hours.push(hour);
        }
      } else {
        if (currentWindow && currentWindow.hours.length >= 2) { // At least 2 hours
          windows.push(currentWindow);
        }
        currentWindow = null;
      }
    });

    // Don't forget the last window
    if (currentWindow && currentWindow.hours.length >= 2) {
      windows.push(currentWindow);
    }

    return windows;
  }

  isPerfectCyclingCondition(hour) {
    const temp = hour.temperature;
    const wind = hour.wind_speed;
    const precipitation = hour.precipitation || 0;
    const condition = hour.condition;
    const timestamp = new Date(hour.timestamp);
    
    // Check if it's daylight (simplified - between 6 AM and 8 PM)
    const hourOfDay = timestamp.getHours();
    const isDaylight = hourOfDay >= 6 && hourOfDay <= 20;

    // Use user preferences for thresholds
    const tempCheck = temp > this.preferences.minTemperature;
    const windCheck = wind < this.preferences.maxWindSpeed;
    const precipitationCheck = precipitation <= this.preferences.maxPrecipitation;
    
    // Sunshine preference check
    const sunshineCheck = !this.preferences.preferSunshine || 
      (condition === 'clear-day' || condition === 'partly-cloudy-day');

    return (
      precipitationCheck &&
      tempCheck &&
      windCheck &&
      (condition === 'dry' || condition === 'clear-day' || condition === 'partly-cloudy-day') &&
      sunshineCheck &&
      isDaylight
    );
  }

  calculateSunshineHours(dayData) {
    return dayData.reduce((total, hour) => {
      return total + (hour.sunshine || 0);
    }, 0) / 60; // Convert from minutes to hours
  }

  calculateAverageTemp(dayData) {
    const validTemps = dayData.filter(h => h.temperature !== null);
    return validTemps.length > 0 
      ? validTemps.reduce((sum, h) => sum + h.temperature, 0) / validTemps.length 
      : 0;
  }

  calculateAverageWind(dayData) {
    const validWinds = dayData.filter(h => h.wind_speed !== null);
    return validWinds.length > 0 
      ? validWinds.reduce((sum, h) => sum + h.wind_speed, 0) / validWinds.length 
      : 0;
  }

  calculateTotalPrecipitation(dayData) {
    return dayData.reduce((total, hour) => total + (hour.precipitation || 0), 0);
  }

  async findDestinationsInRadius(startCoords, radiusKm) {
    try {
      // Use Photon geocoding API to find places within radius
      // Create a bounding box around the start location
      const R = 6371; // Earth's radius in km
      const deltaLat = radiusKm / R * (180 / Math.PI);
      const deltaLon = radiusKm / R * (180 / Math.PI) / Math.cos(startCoords.lat * Math.PI / 180);
      
      const bbox = [
        startCoords.lon - deltaLon, // min_lon
        startCoords.lat - deltaLat, // min_lat
        startCoords.lon + deltaLon, // max_lon
        startCoords.lat + deltaLat  // max_lat
      ].join(',');

      console.log('Searching for destinations near:', startCoords, 'radius:', radiusKm + 'km');
      console.log('Bounding box:', bbox);

      // Search for cities and towns using Photon API
      // Use a broader search approach - search for places near Baden-Württemberg  
      const lat = startCoords.lat;
      const lon = startCoords.lon;
      
      // Try multiple API calls to find actual cities and towns
      const queries = [
        // Search for cities in Baden-Württemberg
        `https://photon.komoot.io/api/?q=stadt baden-württemberg&limit=100&lang=de`,
        // Search for cities broadly in Germany
        `https://photon.komoot.io/api/?q=stadt deutschland&limit=200&lang=de`,
        // Bounding box search
        `https://photon.komoot.io/api/?bbox=${bbox}&limit=50`
      ];
      
      console.log('Trying multiple Photon API approaches...');
      console.log('Queries:', queries);
      
      let data = { features: [] };
      
      // Try each query until we get results
      for (const query of queries) {
        console.log('Trying:', query);
        try {
          const response = await fetch(query);
          if (response.ok) {
            const result = await response.json();
            console.log('Response from', query, ':', result);
            if (result.features && result.features.length > 0) {
              data = result;
              console.log('Success! Found', result.features.length, 'features');
              break;
            }
          }
        } catch (error) {
          console.log('Query failed:', query, error);
        }
      }
      
      if (!data.features || data.features.length === 0) {
        console.log('No features returned from Photon API, trying Nominatim fallback');
        
        // Fallback: Use Nominatim to search for cities within radius
        try {
          const nominatimResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=city&viewbox=${startCoords.lon-1},${startCoords.lat+1},${startCoords.lon+1},${startCoords.lat-1}&bounded=1&limit=50&countrycodes=de`
          );
          
          if (nominatimResponse.ok) {
            const nominatimData = await nominatimResponse.json();
            console.log('Nominatim fallback results:', nominatimData);
            
            // Convert Nominatim format to our expected format
            const nominatimFeatures = nominatimData.map(place => ({
              geometry: {
                coordinates: [parseFloat(place.lon), parseFloat(place.lat)]
              },
              properties: {
                name: place.display_name.split(',')[0], // Get city name
                osm_value: 'city',
                country: 'Germany',
                state: 'Baden-Württemberg'
              }
            }));
            
            if (nominatimFeatures.length > 0) {
              data = { features: nominatimFeatures };
              console.log('Using Nominatim fallback with', nominatimFeatures.length, 'places');
            }
          }
        } catch (error) {
          console.log('Nominatim fallback also failed:', error);
        }
      }
      
      if (!data.features || data.features.length === 0) {
        console.log('All geocoding approaches failed');
        return [];
      }

      console.log('Found', data.features.length, 'places from Photon API');

      // Process results and filter by actual distance
      const allDestinations = data.features.map(feature => {
        const coords = feature.geometry.coordinates;
        const props = feature.properties;
        
        return {
          name: props.name,
          lat: coords[1],
          lon: coords[0],
          type: props.osm_value, // city, town, village
          state: props.state,
          country: props.country,
          distance: this.calculateDistance(startCoords.lat, startCoords.lon, coords[1], coords[0])
        };
      });

      console.log('All destinations with distances:', allDestinations);

      const destinations = allDestinations
        .filter(dest => {
          // Only include German locations
          const isGerman = dest.country === 'Deutschland' || dest.country === 'Germany';
          const withinRadius = dest.distance <= radiusKm;
          const farEnough = dest.distance >= 5; // Reduced from 10km to 5km
          // Only include cities, towns, and villages
          const isSettlement = ['city', 'town', 'village'].includes(dest.type);
          
          console.log(`${dest.name}: country=${dest.country}, type=${dest.type}, isGerman=${isGerman}, isSettlement=${isSettlement}, distance=${dest.distance.toFixed(1)}km, withinRadius=${withinRadius}, farEnough=${farEnough}`);
          console.log(`  → Passes all filters: ${isGerman && withinRadius && farEnough && isSettlement}`);
          
          return isGerman && withinRadius && farEnough && isSettlement;
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 40); // Limit to 40 destinations for better coverage

      console.log('Filtered destinations:', destinations);
      return destinations;

    } catch (error) {
      console.error('Error fetching destinations from Photon API:', error);
      
      // Fallback to a minimal static list of major cities if API fails
      const fallbackDestinations = [
        { name: 'Berlin', lat: 52.5, lon: 13.4 },
        { name: 'Hamburg', lat: 53.6, lon: 10.0 },
        { name: 'Munich', lat: 48.1, lon: 11.6 },
        { name: 'Cologne', lat: 50.9, lon: 6.9 },
        { name: 'Frankfurt', lat: 50.1, lon: 8.7 },
        { name: 'Stuttgart', lat: 48.8, lon: 9.2 },
        { name: 'Düsseldorf', lat: 51.2, lon: 6.8 },
        { name: 'Dortmund', lat: 51.5, lon: 7.5 },
        { name: 'Essen', lat: 51.5, lon: 7.0 },
        { name: 'Dresden', lat: 51.1, lon: 13.7 }
      ];

      console.log('Using fallback destinations');
      return fallbackDestinations.filter(dest => {
        const distance = this.calculateDistance(startCoords.lat, startCoords.lon, dest.lat, dest.lon);
        return distance <= radiusKm && distance >= 10;
      });
    }
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  findSunniestDestination(destinationsWithWeather, startLocationName) {
    let best = null;
    let bestScore = -1;

    destinationsWithWeather.forEach(dest => {
      // Skip if this is the same as start location
      if (dest.name.toLowerCase().includes(startLocationName.toLowerCase()) || 
          startLocationName.toLowerCase().includes(dest.name.toLowerCase())) {
        return;
      }

      // Calculate score based on sunshine hours and perfect cycling days
      const totalSunshine = dest.weather.reduce((sum, day) => sum + day.sunshineHours, 0);
      const perfectDays = dest.weather.filter(day => day.hasPerfectConditions).length;
      const score = totalSunshine + (perfectDays * 2); // Weight perfect days more

      if (score > bestScore) {
        bestScore = score;
        best = dest;
      }
    });

    return best;
  }

  displayWeatherResults(data) {
    document.getElementById('weatherResults').classList.remove('hidden');

    // Update summary metrics first
    this.updateSummaryMetrics(data.start.weather, data.destination.weather);

    // Hide individual location results and show combined day-by-day comparison
    document.getElementById('startLocationResults').style.display = 'none';
    document.getElementById('destinationLocationResults').style.display = 'none';
    
    this.displayCombinedWeatherDays(data);

    // Check if destination has poor cycling weather
    const destinationPerfectDays = data.destination.weather.filter(day => day.hasPerfectConditions).length;
    if (destinationPerfectDays < 2) {
      this.showError(this.t('poorWeatherWarning'));
    }
  }

  displayCombinedWeatherDays(data) {
    // Create or find the combined display container
    let combinedContainer = document.getElementById('combinedWeatherDisplay');
    if (!combinedContainer) {
      combinedContainer = document.createElement('div');
      combinedContainer.id = 'combinedWeatherDisplay';
      combinedContainer.className = 'mb-6';
      
      // Insert after the map container
      const mapContainer = document.getElementById('routeMapContainer');
      mapContainer.parentNode.insertBefore(combinedContainer, mapContainer.nextSibling);
    }
    
    combinedContainer.innerHTML = `
      <h3 class="text-xl font-semibold mb-4 text-gray-900">📅 7-Day Weather Comparison</h3>
      <div class="space-y-4" id="dayComparisons">
        ${this.generateDayComparisons(data)}
      </div>
    `;
  }

  generateDayComparisons(data) {
    const maxDays = Math.max(data.start.weather.length, data.destination.weather.length);
    const comparisons = [];

    for (let i = 0; i < maxDays; i++) {
      const startDay = data.start.weather[i];
      const destDay = data.destination.weather[i];
      
      if (!startDay || !destDay) continue;

      const date = new Date(startDay.date);
      const locale = this.lang === 'en' ? 'en-US' : this.lang === 'fr' ? 'fr-FR' : 'de-DE';
      const dayName = date.toLocaleDateString(locale, { weekday: 'long' });
      const dateStr = date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });

      comparisons.push(`
        <div class="day-comparison bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div class="day-header text-center mb-4">
            <h4 class="text-lg font-semibold text-gray-900">${dayName}</h4>
            <span class="text-sm text-gray-500">${dateStr}</span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Start Location -->
            <div class="location-weather">
              <div class="flex items-center mb-3">
                <span class="text-base mr-3">📍</span>
                <h5 class="text-sm font-semibold text-gray-800">${data.start.name}</h5>
              </div>
              ${this.generateDayWeatherCard(startDay, 'start', i)}
            </div>
            
            <!-- Destination Location -->
            <div class="location-weather">
              <div class="flex items-center mb-3">
                <span class="text-base mr-3">🏁</span>
                <h5 class="text-sm font-semibold text-gray-800">${data.destination.name}</h5>
              </div>
              ${this.generateDayWeatherCard(destDay, 'destination', i)}
            </div>
          </div>
        </div>
      `);
    }

    return comparisons.join('');
  }

  generateDayWeatherCard(day, locationName, dayIndex) {
    const hasIdealTimes = day.cyclingWindows.length > 0;
    const cardId = `${locationName}-day-${dayIndex}`;
    
    if (hasIdealTimes) {
      // Expanded card for days with ideal cycling times (green)
      const windowsHtml = day.cyclingWindows.map(window => {
        const startHour = new Date(window.start).getHours();
        const endHour = new Date(window.end).getHours();
        return `<span class="inline-block bg-white bg-opacity-60 text-green-800 px-2 py-1 rounded text-xs mr-1 mb-1 font-medium">${startHour}:00-${endHour}:00</span>`;
      }).join('');

      return `
        <div class="bg-gray-50 border border-gray-200 rounded-lg">
          <button class="w-full p-3 text-left focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg hover:bg-gray-100 transition-colors" 
                  onclick="
                    const content = this.nextElementSibling;
                    const chevron = this.querySelector('.chevron');
                    content.classList.toggle('hidden');
                    chevron.classList.toggle('rotate-180');
                  ">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="text-base mr-3">✅</span>
                <span class="text-sm text-gray-700 font-medium">${this.t('idealCyclingTimes')}</span>
                <span class="ml-4 flex items-center">${windowsHtml}</span>
              </div>
              <svg class="chevron text-gray-400 transform transition-transform duration-200 rotate-180" style="width: 12px; height: 12px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </button>
          
          <div class="border-t border-gray-200 p-3 bg-gray-25">
            <div class="flex items-center justify-between text-xs text-gray-600 space-x-3 mb-2">
              <span class="flex items-center"><span class="mr-1">☀️</span>${day.sunshineHours.toFixed(1)}h</span>
              <span class="flex items-center"><span class="mr-1">🌡️</span>${day.avgTemp.toFixed(0)}°C</span>
              <span class="flex items-center"><span class="mr-1">💨</span>${day.avgWind.toFixed(1)} km/h</span>
              <span class="flex items-center"><span class="mr-1">🌧️</span>${day.precipitation.toFixed(1)}mm</span>
            </div>
          </div>
        </div>
      `;
    } else {
      // Collapsed card for days without ideal times (gray)
      return `
        <div class="bg-gray-50 border border-gray-200 rounded-lg">
          <button class="w-full p-3 text-left focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg hover:bg-gray-100 transition-colors" 
                  onclick="
                    const content = this.nextElementSibling;
                    const chevron = this.querySelector('.chevron');
                    content.classList.toggle('hidden');
                    chevron.classList.toggle('rotate-180');
                  ">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="text-base mr-3">⚠️</span>
                <span class="text-sm text-gray-700 font-medium">${this.t('noIdealCyclingTimes')}</span>
              </div>
              <svg class="chevron text-gray-400 transform transition-transform duration-200" style="width: 12px; height: 12px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </button>
          
          <div class="hidden border-t border-gray-200 p-3 bg-gray-25">
            <div class="flex items-center justify-between text-xs text-gray-600 space-x-3 mb-2">
              <span class="flex items-center"><span class="mr-1">☀️</span>${day.sunshineHours.toFixed(1)}h</span>
              <span class="flex items-center"><span class="mr-1">🌡️</span>${day.avgTemp.toFixed(0)}°C</span>
              <span class="flex items-center"><span class="mr-1">💨</span>${day.avgWind.toFixed(1)} km/h</span>
              <span class="flex items-center"><span class="mr-1">🌧️</span>${day.precipitation.toFixed(1)}mm</span>
            </div>
            <div class="text-xs text-gray-600">
              <strong>${this.t('whyNotIdeal')}</strong> 
              ${day.avgTemp < this.preferences.minTemperature ? this.t('tooCold').replace('{temp}', this.preferences.minTemperature) + ' ' : ''}
              ${day.avgWind > this.preferences.maxWindSpeed ? this.t('tooWindy').replace('{wind}', this.preferences.maxWindSpeed) + ' ' : ''}
              ${day.precipitation > this.preferences.maxPrecipitation ? this.t('tooMuchRain').replace('{rain}', this.preferences.maxPrecipitation) + ' ' : ''}
            </div>
          </div>
        </div>
      `;
    }
  }

  displayLocationWeather(containerId, locationData) {
    const container = document.getElementById(containerId);
    const nameElement = container.querySelector('.location-name');
    const daysContainer = container.querySelector('.weather-days');

    nameElement.textContent = locationData.name;

    // Generate day cards
    daysContainer.innerHTML = locationData.weather.map(day => {
      const date = new Date(day.date);
      const locale = this.lang === 'en' ? 'en-US' : this.lang === 'fr' ? 'fr-FR' : 'de-DE';
      const dayName = date.toLocaleDateString(locale, { weekday: 'short' });
      const dateStr = date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit' });

      const windowsHtml = day.cyclingWindows.length > 0 
        ? day.cyclingWindows.map(window => {
            const startHour = new Date(window.start).getHours();
            const endHour = new Date(window.end).getHours();
            return `<span class="time-slot">${startHour}:00-${endHour}:00</span>`;
          }).join(' ')
        : `<span class="no-windows">${this.t('noIdealTimes')}</span>`;

      const sunshineBonus = day.sunshineHours > 0 
        ? `<div class="sunshine-bonus">☀️ ${day.sunshineHours.toFixed(1)}h Sonne</div>`
        : '';

      return `
        <div class="day-card ${day.hasPerfectConditions ? 'perfect' : 'poor'}">
          <div class="day-header">
            <div class="day-name">${dayName}</div>
            <div class="day-date">${dateStr}</div>
          </div>
          <div class="cycling-windows">
            ${windowsHtml}
          </div>
          ${sunshineBonus}
          <div class="weather-details">
            <small>🌡️ ${day.avgTemp.toFixed(1)}°C | 💨 ${day.avgWind.toFixed(1)} km/h | 🌧️ ${day.precipitation.toFixed(1)}mm</small>
          </div>
        </div>
      `;
    }).join('');
  }

  showLoading(show) {
    const loadingElement = document.getElementById('loadingState');
    if (show) {
      loadingElement.classList.remove('hidden');
      document.getElementById('weatherResults').classList.add('hidden');
    } else {
      loadingElement.classList.add('hidden');
    }
  }

  showError(message) {
    const errorElement = document.getElementById('errorMessage');
    const errorText = errorElement.querySelector('div');
    errorText.textContent = message;
    errorElement.classList.remove('hidden');
  }

  hideError() {
    document.getElementById('errorMessage').classList.add('hidden');
  }

  // Calculate summary cycling metrics
  calculateCyclingMetrics(startWeather, destinationWeather) {
    let cycleDays = 0;
    let totalHours = 0;
    let nextWindowHours = null;
    
    const now = new Date();
    
    // Create combined analysis of both locations
    const allDays = [];
    
    // Combine start and destination data by date
    const dateMap = {};
    
    startWeather.forEach(day => {
      dateMap[day.date] = { start: day };
    });
    
    destinationWeather.forEach(day => {
      if (dateMap[day.date]) {
        dateMap[day.date].destination = day;
      }
    });
    
    // Analyze each day for cycling opportunities
    Object.keys(dateMap).forEach(date => {
      const { start, destination } = dateMap[date];
      if (!start || !destination) return;
      
      // A day is considered "cycleable" if BOTH locations have cycling windows
      const hasBothWindows = start.hasPerfectConditions && destination.hasPerfectConditions;
      
      if (hasBothWindows) {
        cycleDays++;
        
        // Calculate total hours for each location
        const startHours = start.cyclingWindows.reduce((total, window) => total + (window.hours ? window.hours.length : 0), 0);
        const destinationHours = destination.cyclingWindows.reduce((total, window) => total + (window.hours ? window.hours.length : 0), 0);
        
        // Take average of both locations (represents route conditions)
        const averageHours = (startHours + destinationHours) / 2;
        
        console.log(`Date: ${date}, Start: ${startHours}h, Destination: ${destinationHours}h, Average: ${averageHours}h`);
        
        totalHours += averageHours;
        
        // Find next cycling window
        if (nextWindowHours === null) {
          const dayDate = new Date(date + 'T00:00:00');
          const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          
          if (dayDate >= todayDate) {
            // If it's today, find the next window starting from current time
            if (dayDate.getTime() === todayDate.getTime()) {
              const currentHour = now.getHours();
              
              // Look for a window that starts after the current hour
              for (const window of start.cyclingWindows) {
                if (window.hours && window.hours.length > 0) {
                  const windowStartTime = new Date(window.hours[0].timestamp);
                  const windowStartHour = windowStartTime.getHours();
                  
                  if (windowStartHour > currentHour) {
                    nextWindowHours = windowStartHour - currentHour;
                    break;
                  }
                }
              }
            } else {
              // Future day - calculate hours until first window of that day
              const daysDiff = Math.floor((dayDate - todayDate) / (1000 * 60 * 60 * 24));
              
              if (start.cyclingWindows.length > 0 && start.cyclingWindows[0].hours.length > 0) {
                const firstWindowTime = new Date(start.cyclingWindows[0].hours[0].timestamp);
                const firstWindowHour = firstWindowTime.getHours();
                
                // Calculate total hours: days difference * 24 + hours until window start
                nextWindowHours = (daysDiff * 24) + (firstWindowHour - now.getHours());
                if (nextWindowHours < 0) nextWindowHours += 24;
              }
            }
          }
        }
      }
    });
    
    return {
      cycleDays,
      totalHours: Math.round(totalHours * 10) / 10, // Round to 1 decimal
      nextWindowHours
    };
  }

  // Update summary metrics display
  updateSummaryMetrics(startWeather, destinationWeather) {
    const metrics = this.calculateCyclingMetrics(startWeather, destinationWeather);
    
    console.log('Calculated metrics:', metrics);
    
    // Update cycle days count
    document.getElementById('cycleDaysCount').textContent = metrics.cycleDays;
    
    // Update total cycling hours
    document.getElementById('totalCyclingHours').textContent = 
      `${metrics.totalHours}h`;
    
    // Update next cycling window
    if (metrics.nextWindowHours !== null && metrics.nextWindowHours >= 0) {
      if (metrics.nextWindowHours < 24) {
        document.getElementById('nextCyclingWindow').textContent = 
          `${Math.round(metrics.nextWindowHours)}h`;
      } else {
        const days = Math.floor(metrics.nextWindowHours / 24);
        const hours = Math.round(metrics.nextWindowHours % 24);
        document.getElementById('nextCyclingWindow').textContent = 
          `${days}d ${hours}h`;
      }
    } else {
      document.getElementById('nextCyclingWindow').textContent = 'None';
    }
  }

  // Settings Management
  loadPreferences() {
    const defaultPreferences = {
      minTemperature: 10,
      maxWindSpeed: 20,
      maxPrecipitation: 0,
      preferSunshine: false
    };
    
    const stored = localStorage.getItem('radlWetterPreferences');
    return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
  }

  savePreferences(preferences) {
    localStorage.setItem('radlWetterPreferences', JSON.stringify(preferences));
    this.preferences = preferences;
  }

  showSettingsModal() {
    const modal = document.getElementById('settingsModal');
    const tempSlider = document.getElementById('tempSlider');
    const windSlider = document.getElementById('windSlider');
    const rainSlider = document.getElementById('rainSlider');
    const sunshineCheck = document.getElementById('sunshinePreference');
    
    // Load current preferences
    tempSlider.value = this.preferences.minTemperature;
    windSlider.value = this.preferences.maxWindSpeed;
    rainSlider.value = this.preferences.maxPrecipitation;
    sunshineCheck.checked = this.preferences.preferSunshine;
    
    // Update displays
    this.updateSliderDisplay('temp', this.preferences.minTemperature);
    this.updateSliderDisplay('wind', this.preferences.maxWindSpeed);
    this.updateSliderDisplay('rain', this.preferences.maxPrecipitation);
    
    // Add event listeners for real-time updates
    tempSlider.addEventListener('input', (e) => this.updateSliderDisplay('temp', e.target.value));
    windSlider.addEventListener('input', (e) => this.updateSliderDisplay('wind', e.target.value));
    rainSlider.addEventListener('input', (e) => this.updateSliderDisplay('rain', e.target.value));
    
    // Modal control buttons
    document.getElementById('cancelSettings').addEventListener('click', () => {
      modal.classList.add('hidden');
    });
    
    document.getElementById('saveSettings').addEventListener('click', () => {
      const newPreferences = {
        minTemperature: parseFloat(tempSlider.value),
        maxWindSpeed: parseFloat(windSlider.value),
        maxPrecipitation: parseFloat(rainSlider.value),
        preferSunshine: sunshineCheck.checked
      };
      this.savePreferences(newPreferences);
      modal.classList.add('hidden');
    });
    
    modal.classList.remove('hidden');
  }

  updateSliderDisplay(type, value) {
    const displays = {
      temp: { element: 'tempValue', suffix: '°C' },
      wind: { element: 'windValue', suffix: ' km/h' },
      rain: { element: 'rainValue', suffix: 'mm' }
    };
    
    const display = displays[type];
    if (display) {
      document.getElementById(display.element).textContent = value + display.suffix;
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new RadlWetter();
});