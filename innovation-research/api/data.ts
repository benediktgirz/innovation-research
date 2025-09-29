// Vercel Serverless Function for Research Data Retrieval
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ParticipationRecord {
  id: string;
  club_name: string;
  role: string;
  email: string;
  innovation: string;
  language: string;
  submitted_at: string;
  ip_address: string;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // Simple authentication check
  const authHeader = request.headers.authorization;
  const expectedAuth = `Bearer ${process.env.DATA_ACCESS_TOKEN || 'research-admin-2024'}`;

  if (authHeader !== expectedAuth) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { format = 'json', export_type } = request.query;

    // Get data from storage
    const data = await getResearchData();

    if (export_type === 'analytics') {
      const analytics = await getAnalytics();
      return response.status(200).json(analytics);
    }

    if (format === 'csv') {
      const csv = convertToCSV(data);
      response.setHeader('Content-Type', 'text/csv');
      response.setHeader('Content-Disposition', 'attachment; filename="research-data.csv"');
      return response.status(200).send(csv);
    }

    return response.status(200).json({
      total_responses: data.length,
      data: data,
      exported_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Data retrieval error:', error);
    return response.status(500).json({
      error: 'Internal server error'
    });
  }
}

async function getResearchData(): Promise<ParticipationRecord[]> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return [];
  }

  try {
    // Get list of participation IDs
    const listResponse = await fetch(`${process.env.KV_REST_API_URL}/lrange/participations/0/-1`, {
      headers: {
        'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
      },
    });

    const listData = await listResponse.json();
    const participationIds = listData.result || [];

    // Fetch individual records
    const records: ParticipationRecord[] = [];

    for (const id of participationIds) {
      const recordResponse = await fetch(`${process.env.KV_REST_API_URL}/get/participation:${id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
      });

      const recordData = await recordResponse.json();
      if (recordData.result) {
        records.push(JSON.parse(recordData.result));
      }
    }

    return records.sort((a, b) =>
      new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    );

  } catch (error) {
    console.error('Error fetching research data:', error);
    return [];
  }
}

async function getAnalytics() {
  const data = await getResearchData();

  const analytics = {
    total_responses: data.length,
    by_language: {} as Record<string, number>,
    by_role: {} as Record<string, number>,
    top_clubs: {} as Record<string, number>,
    response_timeline: [] as Array<{ date: string, count: number }>,
    innovation_keywords: [] as Array<{ keyword: string, count: number }>,
    latest_submissions: data.slice(0, 5).map(item => ({
      id: item.id,
      club: item.club_name,
      role: item.role,
      language: item.language,
      submitted_at: item.submitted_at,
      innovation_preview: item.innovation.substring(0, 100) + '...'
    }))
  };

  // Language distribution
  data.forEach(item => {
    analytics.by_language[item.language] = (analytics.by_language[item.language] || 0) + 1;
  });

  // Role distribution
  data.forEach(item => {
    const role = item.role.toLowerCase();
    analytics.by_role[role] = (analytics.by_role[role] || 0) + 1;
  });

  // Top clubs
  data.forEach(item => {
    analytics.top_clubs[item.club_name] = (analytics.top_clubs[item.club_name] || 0) + 1;
  });

  // Timeline (last 30 days)
  const timeline: Record<string, number> = {};
  data.forEach(item => {
    const date = item.submitted_at.split('T')[0]; // Get date part only
    timeline[date] = (timeline[date] || 0) + 1;
  });

  analytics.response_timeline = Object.entries(timeline)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return analytics;
}

function convertToCSV(data: ParticipationRecord[]): string {
  if (data.length === 0) return '';

  const headers = ['ID', 'Club Name', 'Role', 'Email', 'Innovation Response', 'Language', 'Submitted At', 'IP Address'];
  const csvRows = [headers.join(',')];

  data.forEach(row => {
    const values = [
      row.id,
      `"${row.club_name.replace(/"/g, '""')}"`,
      `"${row.role.replace(/"/g, '""')}"`,
      row.email,
      `"${row.innovation.replace(/"/g, '""')}"`,
      row.language,
      row.submitted_at,
      row.ip_address
    ];
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
}