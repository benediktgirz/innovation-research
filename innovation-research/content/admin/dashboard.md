---
layout: base.vto
title: Admin Dashboard
description: Research data administration dashboard
lang: en
---

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <div class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Research Dashboard</h1>
          <p class="mt-1 text-sm text-gray-500">Innovation in Professional Football - Data Administration</p>
        </div>
        <div class="flex items-center space-x-4">
          <button id="export-csv" class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
            Export CSV
          </button>
          <button id="logout-btn" class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span class="text-white font-semibold" id="total-count">0</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Participants</dt>
                <dd class="text-lg font-medium text-gray-900" id="total-participants">Loading...</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span class="text-white font-semibold" id="today-count">0</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Today's Submissions</dt>
                <dd class="text-lg font-medium text-gray-900" id="today-submissions">Loading...</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span class="text-white font-semibold" id="countries-count">0</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Languages</dt>
                <dd class="text-lg font-medium text-gray-900" id="languages-count">Loading...</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                <span class="text-white font-semibold" id="avg-length">0</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Avg Response Length</dt>
                <dd class="text-lg font-medium text-gray-900" id="avg-response-length">Loading...</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Participant Responses</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Complete list of research participants and their responses.</p>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club/Organization</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Innovation Response</th>
            </tr>
          </thead>
          <tbody id="data-table-body" class="bg-white divide-y divide-gray-200">
            <tr>
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">Loading data...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<!-- Error Modal -->
<div id="error-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
  <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
    <div class="mt-3 text-center">
      <h3 class="text-lg font-medium text-gray-900" id="error-title">Error</h3>
      <div class="mt-2 px-7 py-3">
        <p class="text-sm text-gray-500" id="error-message">An error occurred.</p>
      </div>
      <div class="items-center px-4 py-3">
        <button id="close-error-modal" class="px-4 py-2 bg-primary text-white text-base font-medium rounded-md shadow-sm hover:bg-primary-dark">
          OK
        </button>
      </div>
    </div>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = '/admin/login';
    return;
  }

  // DOM elements
  const logoutBtn = document.getElementById('logout-btn');
  const exportCsvBtn = document.getElementById('export-csv');
  const errorModal = document.getElementById('error-modal');
  const errorTitle = document.getElementById('error-title');
  const errorMessage = document.getElementById('error-message');
  const closeErrorModal = document.getElementById('close-error-modal');

  // Event listeners
  logoutBtn.addEventListener('click', logout);
  exportCsvBtn.addEventListener('click', exportToCsv);
  closeErrorModal.addEventListener('click', hideErrorModal);

  function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  }

  function showErrorModal(title, message) {
    errorTitle.textContent = title;
    errorMessage.textContent = message;
    errorModal.classList.remove('hidden');
  }

  function hideErrorModal() {
    errorModal.classList.add('hidden');
  }

  async function loadDashboardData() {
    try {
      const response = await fetch('/api/data?format=json', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        // Token expired or invalid
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      updateStats(data);
      updateTable(data.participants || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Show static mode message for IONOS hosting
      showStaticModeMessage();
    }
  }

  function showStaticModeMessage() {
    // Update stats with placeholder values
    updateStats({
      analytics: {
        total_responses: 0,
        today_responses: 0,
        language_distribution: {},
        avg_innovation_length: 0
      }
    });

    // Show message in table
    const tbody = document.getElementById('data-table-body');
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-8 text-center">
          <div class="text-gray-500">
            <div class="text-lg font-medium mb-2">Static Hosting Mode</div>
            <div class="text-sm">
              Research data is stored securely but requires serverless functions to display.<br>
              For full dashboard functionality, visit the Vercel deployment or configure API access.
            </div>
            <div class="mt-4 text-xs text-gray-400">
              Data collection continues to work normally - only the admin dashboard is affected.
            </div>
          </div>
        </td>
      </tr>
    `;
  }

  function updateStats(data) {
    const stats = data.analytics || {};

    document.getElementById('total-participants').textContent = stats.total_responses || 0;
    document.getElementById('total-count').textContent = stats.total_responses || 0;

    document.getElementById('today-submissions').textContent = stats.today_responses || 0;
    document.getElementById('today-count').textContent = stats.today_responses || 0;

    document.getElementById('languages-count').textContent = Object.keys(stats.language_distribution || {}).length;
    document.getElementById('countries-count').textContent = Object.keys(stats.language_distribution || {}).length;

    document.getElementById('avg-response-length').textContent = Math.round(stats.avg_innovation_length || 0) + ' chars';
    document.getElementById('avg-length').textContent = Math.round(stats.avg_innovation_length || 0);
  }

  function updateTable(participants) {
    const tbody = document.getElementById('data-table-body');

    if (participants.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">No data available</td></tr>';
      return;
    }

    tbody.innerHTML = participants.map(participant => {
      const date = new Date(participant.submitted_at).toLocaleDateString();
      const time = new Date(participant.submitted_at).toLocaleTimeString();
      const innovation = participant.innovation.length > 100
        ? participant.innovation.substring(0, 100) + '...'
        : participant.innovation;

      return `
        <tr class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <div>${date}</div>
            <div class="text-xs text-gray-500">${time}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${participant.club_name}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${participant.role}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${participant.email}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              ${participant.language.toUpperCase()}
            </span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900 max-w-md">
            <div class="truncate" title="${participant.innovation}">${innovation}</div>
          </td>
        </tr>
      `;
    }).join('');
  }

  async function exportToCsv() {
    try {
      exportCsvBtn.disabled = true;
      exportCsvBtn.textContent = 'Exporting...';

      const response = await fetch('/api/data?format=csv', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvData = await response.text();

      // Create download link
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `research-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error exporting CSV:', error);
      showErrorModal('Export Error', 'Export functionality requires serverless functions. Please use the Vercel deployment for data export.');
    } finally {
      exportCsvBtn.disabled = false;
      exportCsvBtn.textContent = 'Export CSV';
    }
  }

  // Load data on page load
  loadDashboardData();

  // Refresh data every 30 seconds
  setInterval(loadDashboardData, 30000);
});
</script>