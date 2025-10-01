module.exports = async (req, res) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    // Check authorization
    const authHeader = req.headers.authorization;
    const expectedToken = process.env.DATA_ACCESS_TOKEN;

    if (!authHeader || !authHeader.startsWith('Bearer ') || !expectedToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    const token = authHeader.split(' ')[1];
    if (token !== expectedToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token"
      });
    }

    // Get query parameters
    const { format = 'json', limit } = req.query;

    // Fetch data from KV store
    const data = await fetchParticipationData(limit);

    if (format === 'csv') {
      // Convert to CSV
      const csv = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="research-data.csv"');
      return res.status(200).send(csv);
    }

    // Return JSON by default
    return res.status(200).json({
      success: true,
      data: data,
      total: data.length,
      exported_at: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Data export error:", error);
    return res.status(500).json({
      success: false,
      message: "Data export failed"
    });
  }
};

async function fetchParticipationData(limit) {
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.log("No KV database configured, returning sample data");
      return getSampleData();
    }

    // Get list of participation IDs
    const listResponse = await fetch(`${process.env.KV_REST_API_URL}/lrange/participations/0/${limit || 100}`, {
      headers: {
        'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
      },
    });

    if (!listResponse.ok) {
      throw new Error(`KV API error: ${listResponse.statusText}`);
    }

    const participationIds = await listResponse.json();

    if (!participationIds.result || participationIds.result.length === 0) {
      return [];
    }

    // Fetch individual participation records
    const participations = [];
    for (const id of participationIds.result) {
      try {
        const recordResponse = await fetch(`${process.env.KV_REST_API_URL}/get/participation:${id}`, {
          headers: {
            'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
          },
        });

        if (recordResponse.ok) {
          const record = await recordResponse.json();
          if (record.result) {
            participations.push(JSON.parse(record.result));
          }
        }
      } catch (error) {
        console.error(`Error fetching participation ${id}:`, error);
      }
    }

    return participations;

  } catch (error) {
    console.error("Error fetching participation data:", error);
    return getSampleData();
  }
}

function getSampleData() {
  return [
    {
      id: "sample-001",
      club_name: "Sample FC",
      role: "Coach",
      email: "sample@example.com",
      innovation: "Sample innovation response for demonstration",
      language: "en",
      submitted_at: new Date().toISOString(),
      ip_address: "127.0.0.1"
    }
  ];
}

function convertToCSV(data) {
  if (data.length === 0) {
    return "No data available";
  }

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ];

  return csvRows.join('\n');
}