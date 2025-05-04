function smartCsvParse(csvText) {
    const rows = [];
    let insideQuote = false;
    let currentRow = [];
    let currentCell = "";
  
    for (let i = 0; i < csvText.length; i++) {
      const char = csvText[i];
      const nextChar = csvText[i + 1];
  
      if (char === '"' && insideQuote && nextChar === '"') {
        currentCell += '"'; // escaped quote
        i++;
      } else if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        currentRow.push(currentCell.trim());
        currentCell = "";
      } else if ((char === '\n' || char === '\r') && !insideQuote) {
        if (currentCell !== "" || currentRow.length > 0) {
          currentRow.push(currentCell.trim());
          rows.push(currentRow);
          currentRow = [];
          currentCell = "";
        }
      } else {
        currentCell += char;
      }
    }
  
    if (currentCell || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      rows.push(currentRow);
    }
  
    if (rows.length < 2) return [];
  
    let header = rows[0];
  
    // 🔥 Fix empty headers
    header = header.map((h, idx) => {
      const name = h.trim();
      return name ? name : `Column${idx + 1}`;
    });
  
    const records = rows.slice(1).map(row => {
      const record = {};
      header.forEach((col, idx) => {
        record[col] = (row[idx] !== undefined) ? row[idx].trim() : "";
      });
      return record;
    });
  
    return records;
  }
  
  
  
  
  
  
  function convertFormSpecToGridData(formSpec) {
    const fieldLabels = {};
    const recordsMap = {};
  
    formSpec.forEach(section => {
      section.fields.forEach(field => {
        const match = field.key.match(/^([a-zA-Z]+)(\d+)$/);
        if (match) {
          const baseKey = match[1];   // like "firstName"
          const recordNumber = match[2]; // like "1"
  
          if (!recordsMap[recordNumber]) recordsMap[recordNumber] = {};
          recordsMap[recordNumber][baseKey] = field.default || "";
  
          if (!fieldLabels[baseKey]) {
            fieldLabels[baseKey] = field.label || baseKey;
          }
        }
      });
    });
  
    const fields = Object.keys(fieldLabels).map(baseKey => ({
      key: baseKey,
      label: fieldLabels[baseKey]
    }));
  
    const records = Object.values(recordsMap);
  
    return { fields, records };
  }
  
  
 
  

  function downloadCsvFromGrid() {
    if (!currentRecords || currentRecords.length === 0) {
      alert("No data to download!");
      return;
    }
  
    const headers = currentFields.map(f => f.key);
    const csvRows = [];
  
    // Header row
    csvRows.push(headers.join(","));
  
    // Data rows
    currentRecords.forEach(record => {
      const row = headers.map(key => {
        const val = record[key] ?? "";
        return `"${val.toString().replace(/"/g, '""')}"`; // Escape quotes
      });
      csvRows.push(row.join(","));
    });
  
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "grid-data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  
    URL.revokeObjectURL(url);
    console.log("📤 CSV download triggered!");
  }


  function confirmAction(message) {
    return new Promise((resolve) => {
      showConfirmDialog({
        message,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false)
      });
    });
  }
  
  // 🔥 Make it globally available
  if (typeof window !== "undefined") {
    window.confirmAction = confirmAction;
  }
    

  async function fetchApiData(endpoint, apiKey) {
    if (!endpoint) {
      alert("Please provide a valid API endpoint.");
      return;
    }
  
    try {
      const headers = {};
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }
  
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";  // Add CORS proxy URL
      const fullUrl = proxyUrl + endpoint; // Add your endpoint after the proxy URL
      
      const response = await fetch(fullUrl, { method: 'GET', headers });
  
      console.log("API Request:", {
        url: fullUrl,
        method: 'GET',
        headers
      });
  
      if (!response.ok) {
        throw new Error('API request failed: ' + response.statusText);
      }
  
      const contentType = response.headers.get("content-type") || "";
      let data;
  
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text); // In case it's JSON but with wrong content-type
        } catch {
          data = { message: text }; // Fallback to raw text
        }
      }
  
      console.log("API Response:", data);
      handleApiResponse(data);
  
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data: " + (error.message || "Unknown error"));
    }
  }
  
  
  