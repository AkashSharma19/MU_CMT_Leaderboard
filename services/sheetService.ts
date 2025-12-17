import { TeamData, StockPosition } from '../types';

// Mock data to display initially
export const MOCK_DATA: TeamData[] = [
  { 
    rank: 1, 
    teamName: 'Insomno', 
    plPercentage: 360.54, 
    totalMoneyDeployed: 100000, 
    currentNav: 460540,
    stocks: [
      { name: 'Nvidia', buyPrice: 400, quantity: 10, cmp: 950, currentValue: 9500, investmentAmount: 4000 },
      { name: 'Bitcoin', buyPrice: 30000, quantity: 0.5, cmp: 65000, currentValue: 32500, investmentAmount: 15000 }
    ] 
  },
  { 
    rank: 2, 
    teamName: 'Nexo', 
    plPercentage: 326.63, 
    stocks: [] 
  },
];

/**
 * Fetches and parses CSV data from a published Google Sheet.
 * Handles row skipping and flexible column mapping.
 */
export const fetchSheetData = async (
  csvUrl: string, 
  teamColHeader: string = 'Team Name', 
  plColHeader: string = 'Gain/ Loss (In %)'
): Promise<TeamData[]> => {
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }
    const text = await response.text();
    
    // Manual CSV parsing to handle quotes correctly
    const parseCSVLine = (line: string): string[] => {
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      // Clean quotes
      return result.map(field => field.replace(/^"|"$/g, '').replace(/""/g, '"').trim());
    };

    const rows = text.split('\n').map(parseCSVLine);
    
    // Need at least 2 rows to have headers and data
    if (rows.length < 2) return [];

    let headerRowIndex = -1;
    let headers: string[] = [];

    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '').trim();
    const targetTeam = normalize(teamColHeader);
    const targetPL = normalize(plColHeader);

    // Strategy: Prioritize checking Row 2 (index 1) as per user description
    const potentialHeaderRows = [1, 0, 2, 3, 4];

    for (const rowIndex of potentialHeaderRows) {
        if (rowIndex >= rows.length) continue;
        
        const row = rows[rowIndex].map(normalize);
        const hasTeam = row.some(cell => cell.includes(targetTeam));
        // Strict check for PL first, then loose
        const hasPL = row.some(cell => cell === targetPL || cell.includes(targetPL) || (cell.includes('gain') && cell.includes('loss')));

        if (hasTeam && hasPL) {
            headerRowIndex = rowIndex;
            headers = rows[rowIndex].map(normalize);
            break;
        }
    }

    if (headerRowIndex === -1) {
      // Fallback
      if (rows.length > 1) {
          headerRowIndex = 1;
          headers = rows[1].map(normalize);
      } else {
         throw new Error(`Could not find columns "${teamColHeader}" or "${plColHeader}".`);
      }
    }

    // --- Column Identification ---
    
    // 1. Basic Info Columns
    const teamIndex = headers.findIndex(h => h.includes(targetTeam));
    
    // Identify Sno column
    const snoIndex = headers.findIndex(h => {
        const clean = h.replace(/\./g, ''); 
        return clean === 'sno' || clean === 'no' || clean === '#' || clean === 'rank' || clean === 'serialno';
    });

    let plIndex = headers.findIndex(h => h === targetPL || h.includes(targetPL));
    if (plIndex === -1) {
        plIndex = headers.findIndex(h => h.includes('gain') && h.includes('loss'));
    }

    // Optional: Total Money Deployed and Current NAV
    // We look for 'totalmoney', 'deployed', OR 'investment' to capture common variations.
    let moneyIndex = headers.findIndex(h => 
        h.includes('totalmoney') || 
        h.includes('money') || 
        h.includes('deployed') || 
        h.includes('totalinvestment') ||
        h.includes('investment')
    );
    
    let navIndex = headers.findIndex(h => h.includes('currentnav') || h.includes('currentvalue') || h.includes('nav'));

    // FALLBACK STRATEGY (Positional): 
    if (teamIndex !== -1) {
        // Fallback for Money Deployed: Check immediate next column (Team + 1)
        if (moneyIndex === -1 && (teamIndex + 1) < headers.length) {
            moneyIndex = teamIndex + 1;
        }
        // Fallback for NAV: Check 2 columns after team (Team + 2)
        if (navIndex === -1 && (teamIndex + 2) < headers.length) {
            navIndex = teamIndex + 2;
        }
    }

    if (teamIndex === -1 || plIndex === -1) {
        throw new Error(`Could not find columns in identified header row ${headerRowIndex + 1}.`);
    }

    // 2. Stock Column Identification
    let stockHeaderRow = rows[headerRowIndex];
    if (headerRowIndex > 0) {
        // Check the row above for stock headers
        const rowAbove = rows[headerRowIndex - 1].map(normalize);
        if (rowAbove.some(c => c.includes('buyingprice'))) {
            stockHeaderRow = rows[headerRowIndex - 1]; // Use row above for stock mapping
        }
    }

    const stockDefinitions: number[] = [];
    stockHeaderRow.forEach((cell, index) => {
        const c = normalize(cell);
        if (c.includes('buyingprice') || c === 'buyingprice') {
            stockDefinitions.push(index);
        }
    });

    // --- Data Parsing ---

    const data: TeamData[] = rows.slice(headerRowIndex + 1)
      .map((row): TeamData | null => {
        // Ensure row has enough columns
        if (!row[teamIndex]) return null;

        // Sno Check
        if (snoIndex !== -1) {
            const snoValue = row[snoIndex];
            if (!snoValue || snoValue.trim() === '') return null;
        }

        const teamName = row[teamIndex];
        if (!teamName || teamName.trim() === '') return null;

        // Helper to parse currency/number
        const parseNum = (val: string | undefined) => {
             if (!val) return 0;
             // Regex to clean string:
             // 1. Remove anything that is NOT digit, dot, or minus.
             // 2. This effectively strips currency symbols (₹, $), commas (,), spaces, letters.
             const cleaned = val.replace(/[^0-9.-]/g, '');
             const num = parseFloat(cleaned);
             return isNaN(num) ? 0 : num;
        };

        // Parse PL
        const rawPl = row[plIndex];
        let pl: number | null = null;
        if (rawPl && rawPl.trim() !== '' && rawPl.trim() !== '#DIV/0!') {
             pl = parseNum(rawPl);
        }

        // Parse Investment Stats
        const totalMoneyDeployed = (moneyIndex !== -1 && row[moneyIndex]) ? parseNum(row[moneyIndex]) : 0;
        const currentNav = (navIndex !== -1 && row[navIndex]) ? parseNum(row[navIndex]) : 0;

        // Parse Stocks
        const stocks: StockPosition[] = [];
        stockDefinitions.forEach(buyPriceIdx => {
            const nameIdx = buyPriceIdx - 2;
            const amntIdx = buyPriceIdx - 1;
            const unitsIdx = buyPriceIdx + 1;
            const cmpIdx = buyPriceIdx + 2;
            const valIdx = buyPriceIdx + 3;

            if (nameIdx < 0) return;

            const stockName = row[nameIdx];
            if (stockName && stockName.trim()) {
                stocks.push({
                    name: stockName.trim(),
                    investmentAmount: parseNum(row[amntIdx]),
                    buyPrice: parseNum(row[buyPriceIdx]),
                    quantity: parseNum(row[unitsIdx]),
                    cmp: parseNum(row[cmpIdx]),
                    currentValue: parseNum(row[valIdx])
                });
            }
        });

        return {
          rank: 0, 
          teamName: teamName.trim(),
          plPercentage: pl,
          totalMoneyDeployed,
          currentNav,
          stocks
        };
      })
      .filter((item): item is TeamData => item !== null);

    // Sort by P/L Descending.
    data.sort((a, b) => {
        if (a.plPercentage === null && b.plPercentage === null) return 0;
        if (a.plPercentage === null) return 1;
        if (b.plPercentage === null) return -1;
        return (b.plPercentage || 0) - (a.plPercentage || 0);
    });

    // Assign Ranks
    return data.map((item, index) => ({ ...item, rank: index + 1 }));

  } catch (error) {
    console.error("Sheet Fetch Error:", error);
    throw error;
  }
};