---
layout: simple.vto
indexable: true
url: '/cycling-weather/'
title: 'Cycling Weather Windows'
description: 'Find perfect cycling weather windows for routes in Germany over the next 7 days.'
lang: 'en'
---

Cycling weather windows for routes in Germany over the next 7 days

<div class="radl-weather-app">
  <div class="location-inputs mb-6">
    <!-- Input Fields Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label for="startLocation" class="block text-sm font-medium mb-2">Start location:</label>
        <input type="text" id="startLocation" value="Freiburg im Breisgau" placeholder="e.g. Berlin" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>
      <div>
        <label for="destinationLocation" class="block text-sm font-medium mb-2">Destination:</label>
        <input type="text" id="destinationLocation" placeholder="e.g. Munich" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>
    </div>
    
    <!-- Destination Configuration Panel -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
      <div class="text-xs font-medium text-gray-600 mb-2">Destination Options:</div>
      <div class="grid grid-cols-3 gap-2">
        <button id="suggestDestination" class="px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs h-10 flex items-center justify-center">🌞 Sunny</button>
        <button id="radiusButton" class="px-2 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-xs border border-gray-300 h-10 flex items-center justify-center">📍 50 KM</button>
        <button id="resetDestination" class="px-2 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-xs border border-gray-300 h-10 flex items-center justify-center">🔄 Reset</button>
      </div>
    </div>
    
    <div class="mt-4 flex justify-center gap-3">
      <button id="searchWeather" class="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
        Check Weather
      </button>
      <button id="settingsButton" class="px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors border border-gray-300">
        <span class="mr-1">⚙️</span>Settings
      </button>
    </div>
  </div>

  <div id="loadingState" class="hidden text-center py-8">
    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    <p class="mt-2 text-gray-600">Loading weather data...</p>
  </div>

  <div id="weatherResults" class="hidden">
    <h2 class="text-xl font-semibold mb-4">7-Day Cycling Weather Forecast</h2>
    
    <!-- Summary Metrics -->
    <div class="mb-8 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6">
      <h3 class="text-lg font-semibold mb-4 text-center text-gray-800"><span class="mr-2">📊</span>Next 7 Days Cycling Summary</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <div class="text-2xl font-bold text-green-600" id="cycleDaysCount">-</div>
          <div class="text-sm text-gray-600 mt-1">Cycle Days Available</div>
          <div class="text-xs text-gray-500 mt-1">Days with cycling windows</div>
        </div>
        <div class="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <div class="text-2xl font-bold text-blue-600" id="totalCyclingHours">-</div>
          <div class="text-sm text-gray-600 mt-1">Rain-Free Hours</div>
          <div class="text-xs text-gray-500 mt-1">Total cycling time available</div>
        </div>
        <div class="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <div class="text-2xl font-bold text-orange-600" id="nextCyclingWindow">-</div>
          <div class="text-sm text-gray-600 mt-1">Next Window In</div>
          <div class="text-xs text-gray-500 mt-1">Time until next opportunity</div>
        </div>
      </div>
      
      <!-- Disclaimer -->
      <div class="text-center mt-2 pt-2 border-t border-gray-200">
        <div class="text-sm text-gray-600">
          Based on these 
          <button id="settingsLinkFromMetrics" class="text-blue-500 hover:text-blue-700 underline">
            Cycling Weather Configurations
          </button>
        </div>
      </div>
    </div>
    
    <!-- Route Map -->
    <div id="routeMapContainer" class="mb-6">
      <h3 class="text-lg font-medium mb-3"><span class="mr-2">🗺️</span>Route Overview</h3>
      <div id="routeMap" class="w-full h-64 bg-gray-100 rounded-lg border border-gray-300 relative overflow-hidden">
        <div class="absolute inset-0 flex items-center justify-center text-gray-500">
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p>Loading map...</p>
          </div>
        </div>
      </div>
      <div id="routeWeatherWarning" class="mt-3 hidden"></div>
    </div>
    
    <div id="startLocationResults" class="mb-6">
      <h3 class="text-lg font-medium mb-3"><span class="mr-2">📍</span><span class="location-name"></span> (Start)</h3>
      <div class="weather-days grid gap-4"></div>
    </div>
    
    <div id="destinationLocationResults" class="mb-6">
      <h3 class="text-lg font-medium mb-3"><span class="mr-2">🏁</span><span class="location-name"></span> (Destination)</h3>
      <div class="weather-days grid gap-4"></div>
    </div>
  </div>

  <div id="errorMessage" class="hidden bg-red-50 border border-red-200 rounded-md p-4 mb-4">
    <div class="text-red-800"></div>
  </div>
</div>

<!-- FAQ Section -->
<div class="mt-12 bg-gray-50 border border-gray-200 rounded-xl p-6">
  <h2 class="text-xl font-semibold mb-6 text-gray-800"><span class="mr-2">❓</span>Frequently Asked Questions</h2>
  
  <div class="space-y-4">
    <div class="bg-gray-50 border border-gray-200 rounded-lg">
      <button class="w-full p-3 text-left focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg hover:bg-gray-100 transition-colors" 
              onclick="const content = document.getElementById('faq-data-answer-en'); const chevron = this.querySelector('.chevron'); content.classList.toggle('hidden'); chevron.classList.toggle('rotate-180'); this.setAttribute('aria-expanded', content.classList.contains('hidden') ? 'false' : 'true');"
              aria-expanded="false"
              aria-controls="faq-data-answer-en">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-800">What data is being used?</h3>
          <svg class="chevron text-gray-400 transform transition-transform duration-200" style="width: 12px; height: 12px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </button>
      
      <div id="faq-data-answer-en" class="hidden border-t border-gray-200 p-3 bg-white">
        <p class="text-sm text-gray-600">For Germany, we use data from the German Weather Service (DWD). The API is provided by <a href="https://brightsky.dev/" target="_blank" rel="nofollow" class="text-blue-500 hover:text-blue-700 underline">Bright Sky</a>.</p>
      </div>
    </div>
    
    <div class="bg-gray-50 border border-gray-200 rounded-lg">
      <button class="w-full p-3 text-left focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg hover:bg-gray-100 transition-colors" 
              onclick="const content = document.getElementById('faq-frequency-answer-en'); const chevron = this.querySelector('.chevron'); content.classList.toggle('hidden'); chevron.classList.toggle('rotate-180'); this.setAttribute('aria-expanded', content.classList.contains('hidden') ? 'false' : 'true');"
              aria-expanded="false"
              aria-controls="faq-frequency-answer-en">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-800">In what frequency is the weather data checked?</h3>
          <svg class="chevron text-gray-400 transform transition-transform duration-200" style="width: 12px; height: 12px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </button>
      
      <div id="faq-frequency-answer-en" class="hidden border-t border-gray-200 p-3 bg-white">
        <p class="text-sm text-gray-600">Hourly data. So for the daytime of let's say 14 daytime hours, there is weather data checked 14 times for that day.</p>
      </div>
    </div>
  </div>
</div>

<!-- Settings Modal -->
<div id="settingsModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
    <h3 class="text-lg font-semibold mb-4">Cycling Weather Preferences</h3>
    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">Minimum Temperature (°C)</label>
        <input type="range" id="tempSlider" min="0" max="25" value="10" class="w-full">
        <div class="flex justify-between text-xs text-gray-600 mt-1">
          <span>0°C</span>
          <span id="tempValue">10°C</span>
          <span>25°C</span>
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-2">Maximum Wind Speed (km/h)</label>
        <input type="range" id="windSlider" min="10" max="50" value="20" class="w-full">
        <div class="flex justify-between text-xs text-gray-600 mt-1">
          <span>10 km/h</span>
          <span id="windValue">20 km/h</span>
          <span>50 km/h</span>
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-2">Maximum Precipitation (mm)</label>
        <input type="range" id="rainSlider" min="0" max="10" value="0" step="0.1" class="w-full">
        <div class="flex justify-between text-xs text-gray-600 mt-1">
          <span>0mm</span>
          <span id="rainValue">0mm</span>
          <span>10mm</span>
        </div>
      </div>
      
      <div>
        <label class="flex items-center space-x-2">
          <input type="checkbox" id="sunshinePreference" class="rounded">
          <span class="text-sm">Prefer sunny conditions</span>
        </label>
      </div>
    </div>
    
    <div class="flex gap-2 mt-6">
      <button id="cancelSettings" class="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
        Cancel
      </button>
      <button id="saveSettings" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Save Preferences
      </button>
    </div>
  </div>
</div>

<!-- Radius Selection Modal -->
<div id="radiusModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
    <h3 class="text-lg font-semibold mb-4">Select Radius</h3>
    <div class="mb-4">
      <input type="range" id="radiusSlider" min="5" max="200" value="50" class="w-full">
      <div class="flex justify-between text-sm text-gray-600 mt-1">
        <span>5 KM</span>
        <span id="radiusValue">50 KM</span>
        <span>200 KM</span>
      </div>
    </div>
    <div class="flex gap-2">
      <button id="cancelRadius" class="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
        Cancel
      </button>
      <button id="confirmRadius" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Confirm
      </button>
    </div>
  </div>
</div>

<!-- Leaflet CSS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />

<!-- Leaflet JS -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

<script src="/js/radl-wetter.js"></script>