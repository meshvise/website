/*
 * Donnees de la grille "tout ce que Meshvise lit". Placeholders SVG
 * volontairement schematiques (silhouettes ligne fine), a remplacer
 * plus tard par des illustrations cohérentes.
 *
 * Chaque entree :
 *  - id      : identifiant pour key React-style
 *  - label   : nom affiche en français
 *  - protocol: badge mono affiche sous le label
 *  - svg     : markup SVG inline, viewBox 0 0 48 48, stroke uniquement
 */

export interface EquipItem {
  id: string;
  label: string;
  protocol: string;
  svg: string;
}

const wrap = (inner: string): string =>
  `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

export const equipItems: EquipItem[] = [
  {
    id: 'plc',
    label: 'Automate',
    protocol: 'OPC-UA',
    svg: wrap(`
      <rect x="8" y="12" width="32" height="24" rx="1.5"/>
      <path d="M14 18h4 M22 18h4 M30 18h4 M14 24h4 M22 24h4 M30 24h4"/>
      <circle cx="16" cy="32" r="1.2" fill="currentColor"/>
      <circle cx="22" cy="32" r="1.2" fill="currentColor"/>
      <circle cx="28" cy="32" r="1.2" fill="currentColor"/>
    `),
  },
  {
    id: 'vfd',
    label: 'Variateur',
    protocol: 'Modbus TCP',
    svg: wrap(`
      <rect x="13" y="8" width="22" height="32" rx="1.5"/>
      <rect x="17" y="13" width="14" height="8" rx="1"/>
      <path d="M19 26v9 M24 26v9 M29 26v9"/>
      <circle cx="19" cy="36" r="1" fill="currentColor"/>
      <circle cx="24" cy="36" r="1" fill="currentColor"/>
      <circle cx="29" cy="36" r="1" fill="currentColor"/>
    `),
  },
  {
    id: 'energy-meter',
    label: 'Compteur d\'énergie',
    protocol: 'Modbus TCP',
    svg: wrap(`
      <rect x="9" y="9" width="30" height="30" rx="2"/>
      <rect x="14" y="14" width="20" height="9" rx="1"/>
      <path d="M17 18h3 M22 18h4 M28 18h3"/>
      <circle cx="18" cy="32" r="2"/>
      <circle cx="30" cy="32" r="2"/>
    `),
  },
  {
    id: 'water-meter',
    label: 'Compteur d\'eau',
    protocol: 'M-Bus',
    svg: wrap(`
      <circle cx="24" cy="20" r="9"/>
      <circle cx="24" cy="20" r="2" fill="currentColor"/>
      <path d="M24 14v3 M30 20h-3"/>
      <rect x="6" y="32" width="36" height="6" rx="1"/>
      <path d="M14 32v6 M34 32v6"/>
    `),
  },
  {
    id: 'gas-meter',
    label: 'Compteur de gaz',
    protocol: 'M-Bus',
    svg: wrap(`
      <path d="M10 19c0-3 2-5 5-5h18c3 0 5 2 5 5v17H10z"/>
      <circle cx="24" cy="24" r="5"/>
      <path d="M24 21v3"/>
      <path d="M16 36v3 M24 36v3 M32 36v3"/>
    `),
  },
  {
    id: 'ups',
    label: 'Onduleur',
    protocol: 'Modbus TCP',
    svg: wrap(`
      <rect x="8" y="18" width="32" height="20" rx="1.5"/>
      <rect x="13" y="22" width="22" height="6" rx="0.8"/>
      <rect x="13" y="22" width="14" height="6" rx="0.8" fill="currentColor"/>
      <path d="M14 14c2-3 4-3 6 0s4 3 6 0s4-3 6 0s4 3 6 0"/>
      <path d="M14 33h4 M22 33h4 M28 33h6"/>
    `),
  },
  {
    id: 'pv',
    label: 'Onduleur PV',
    protocol: 'Modbus TCP',
    svg: wrap(`
      <rect x="6" y="10" width="36" height="16" rx="1"/>
      <path d="M6 14h36 M6 18h36 M6 22h36 M14 10v16 M22 10v16 M30 10v16"/>
      <path d="M24 26v6"/>
      <rect x="18" y="32" width="12" height="6" rx="1"/>
    `),
  },
  {
    id: 'ahu',
    label: 'Centrale d\'air',
    protocol: 'BACnet/IP',
    svg: wrap(`
      <rect x="6" y="14" width="28" height="20" rx="1.5"/>
      <path d="M10 18v12 M14 18v12 M18 18v12 M22 18v12 M26 18v12 M30 18v12"/>
      <path d="M34 20h6 M34 28h6 M40 20v8"/>
    `),
  },
  {
    id: 'chiller',
    label: 'Groupe froid',
    protocol: 'Modbus TCP',
    svg: wrap(`
      <rect x="6" y="10" width="36" height="28" rx="2"/>
      <circle cx="24" cy="24" r="8"/>
      <path d="M24 16c4 2 4 14 0 16 M24 16c-4 2 -4 14 0 16 M16 24c2-4 14-4 16 0 M16 24c2 4 14 4 16 0"/>
    `),
  },
  {
    id: 'boiler',
    label: 'Chaudière',
    protocol: 'Modbus TCP',
    svg: wrap(`
      <rect x="13" y="16" width="22" height="22" rx="1.5"/>
      <path d="M22 16v-6h4v6"/>
      <path d="M21 26c0-3 2-3 3-5c1 2 3 2 3 5c0 2-1.5 3-3 3s-3-1-3-3z"/>
      <path d="M17 33h14"/>
    `),
  },
  {
    id: 'heat-pump',
    label: 'Pompe à chaleur',
    protocol: 'Modbus TCP',
    svg: wrap(`
      <rect x="6" y="14" width="36" height="22" rx="1.5"/>
      <circle cx="20" cy="25" r="6"/>
      <path d="M20 19v12 M14 25h12 M16 21l8 8 M16 29l8-8"/>
      <rect x="32" y="20" width="6" height="10" rx="0.5"/>
    `),
  },
  {
    id: 'temp-probe',
    label: 'Sonde température',
    protocol: 'Modbus RTU',
    svg: wrap(`
      <rect x="20" y="6" width="8" height="28" rx="4"/>
      <circle cx="24" cy="38" r="6"/>
      <rect x="22" y="14" width="4" height="22" rx="2" fill="currentColor"/>
      <path d="M30 16h3 M30 22h3 M30 28h3"/>
    `),
  },
  {
    id: 'humidity-probe',
    label: 'Sonde humidité',
    protocol: 'Modbus RTU',
    svg: wrap(`
      <rect x="20" y="8" width="8" height="22" rx="2"/>
      <path d="M24 8v22"/>
      <path d="M24 36c-3 0-5-3-5-5c0-2 5-7 5-7s5 5 5 7c0 2-2 5-5 5z"/>
    `),
  },
  {
    id: 'co2-probe',
    label: 'Sonde CO2',
    protocol: 'BACnet/IP',
    svg: wrap(`
      <path d="M24 6v8"/>
      <rect x="14" y="14" width="20" height="24" rx="2"/>
      <path d="M18 22h12 M18 27h12 M18 32h12"/>
      <circle cx="24" cy="22" r="0.8" fill="currentColor"/>
    `),
  },
  {
    id: 'gearmotor',
    label: 'Motoréducteur',
    protocol: 'Modbus TCP',
    svg: wrap(`
      <circle cx="14" cy="24" r="8"/>
      <rect x="22" y="18" width="20" height="12" rx="1.5"/>
      <line x1="22" y1="24" x2="42" y2="24"/>
      <circle cx="32" cy="24" r="2.5"/>
    `),
  },
  {
    id: 'pump',
    label: 'Pompe',
    protocol: 'Modbus TCP',
    svg: wrap(`
      <rect x="10" y="18" width="20" height="20" rx="2"/>
      <circle cx="20" cy="28" r="6"/>
      <path d="M20 22a6 6 0 0 1 6 6 M20 34a6 6 0 0 1 -6 -6"/>
      <rect x="30" y="14" width="10" height="8" rx="1"/>
      <path d="M20 18v-6"/>
    `),
  },
  {
    id: 'compressor',
    label: 'Compresseur',
    protocol: 'Modbus TCP',
    svg: wrap(`
      <rect x="6" y="24" width="36" height="12" rx="6"/>
      <circle cx="12" cy="30" r="2" fill="currentColor"/>
      <circle cx="36" cy="30" r="2" fill="currentColor"/>
      <rect x="20" y="12" width="14" height="10" rx="1.5"/>
      <line x1="16" y1="22" x2="16" y2="26"/>
    `),
  },
  {
    id: 'conveyor',
    label: 'Convoyeur',
    protocol: 'Modbus TCP',
    svg: wrap(`
      <rect x="6" y="20" width="36" height="10" rx="5"/>
      <circle cx="12" cy="25" r="3"/>
      <circle cx="24" cy="25" r="3"/>
      <circle cx="36" cy="25" r="3"/>
      <rect x="14" y="12" width="6" height="6" rx="0.5"/>
      <rect x="22" y="12" width="6" height="6" rx="0.5"/>
      <rect x="30" y="12" width="6" height="6" rx="0.5"/>
    `),
  },
  {
    id: 'valve',
    label: 'Vanne motorisée',
    protocol: 'Modbus RTU',
    svg: wrap(`
      <rect x="20" y="8" width="8" height="14" rx="1"/>
      <rect x="14" y="22" width="20" height="8" rx="0.5"/>
      <path d="M6 26h8 M34 26h8"/>
      <path d="M18 22l12 8 M30 22l-12 8"/>
    `),
  },
  {
    id: 'tank',
    label: 'Cuve',
    protocol: 'Modbus TCP',
    svg: wrap(`
      <ellipse cx="24" cy="10" rx="10" ry="3"/>
      <path d="M14 10v28 M34 10v28"/>
      <path d="M14 38a10 3 0 0 0 20 0"/>
      <path d="M16 22h16"/>
      <circle cx="24" cy="22" r="1.5" fill="currentColor"/>
    `),
  },
  {
    id: 'silo',
    label: 'Silo',
    protocol: 'Modbus RTU',
    svg: wrap(`
      <rect x="16" y="8" width="16" height="20"/>
      <path d="M16 28l-4 12h24l-4-12"/>
      <line x1="16" y1="14" x2="32" y2="14"/>
    `),
  },
  {
    id: 'scale',
    label: 'Bascule',
    protocol: 'Modbus TCP',
    svg: wrap(`
      <rect x="6" y="34" width="36" height="6" rx="1"/>
      <rect x="20" y="14" width="8" height="20" rx="1"/>
      <rect x="14" y="8" width="20" height="8" rx="1"/>
      <path d="M18 12h12 M18 14h8"/>
    `),
  },
  {
    id: 'switchboard',
    label: 'TGBT',
    protocol: 'Modbus TCP',
    svg: wrap(`
      <rect x="10" y="6" width="28" height="36" rx="1.5"/>
      <path d="M10 14h28 M10 22h28 M10 30h28"/>
      <rect x="14" y="9" width="6" height="3" rx="0.3"/>
      <rect x="22" y="9" width="6" height="3" rx="0.3"/>
      <rect x="14" y="17" width="20" height="3" rx="0.3"/>
      <circle cx="24" cy="36" r="1" fill="currentColor"/>
    `),
  },
  {
    id: 'transformer',
    label: 'Transformateur',
    protocol: 'Modbus TCP',
    svg: wrap(`
      <rect x="8" y="14" width="32" height="20" rx="2"/>
      <circle cx="18" cy="24" r="5"/>
      <circle cx="30" cy="24" r="5"/>
      <line x1="14" y1="10" x2="14" y2="14"/>
      <line x1="20" y1="10" x2="20" y2="14"/>
      <line x1="28" y1="34" x2="28" y2="38"/>
      <line x1="34" y1="34" x2="34" y2="38"/>
    `),
  },
];
