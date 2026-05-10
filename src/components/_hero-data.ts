// Shared hotspot data for the hero variants v1 (Lacroix-purist) and v3
// (Sober + IndustrialSceneStrip). x/y are percentages of the illustration
// container, anchored on the equipment they identify.
//
// Position calibration is approximate — fine-tuned by eye against
// public/images/hero/site-illustration.png at 1440x900 viewport.

export interface EquipmentHotspot {
  id: string;
  x: number;          // 0-100 (% of container width)
  y: number;          // 0-100 (% of container height)
  label: string;
  protocol: string;
  delay_ms: number;   // staggered animation entrance
}

export const equipmentHotspots: EquipmentHotspot[] = [
  { id: 'tanks',      x: 71, y: 23, label: 'Cuves',          protocol: 'Modbus TCP', delay_ms: 400  },
  { id: 'plc',        x: 39, y: 53, label: 'Automate',       protocol: 'OPC-UA',     delay_ms: 700  },
  { id: 'conveyor',   x: 88, y: 38, label: 'Convoyeur',      protocol: 'Modbus TCP', delay_ms: 1000 },
  { id: 'motors',     x: 57, y: 75, label: 'Motoréducteurs', protocol: 'Modbus TCP', delay_ms: 1300 },
  { id: 'substation', x: 90, y: 80, label: 'Sous-station',   protocol: 'Modbus TCP', delay_ms: 1600 },
];
