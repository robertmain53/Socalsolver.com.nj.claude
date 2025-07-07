export interface UnitDefinition {
  name: string;
  symbol: string;
  toBase: number; // Conversion factor to base unit
  category: string;
}

export interface UnitCategory {
  name: string;
  baseUnit: string;
  units: UnitDefinition[];
}

export const UNIT_CATEGORIES: Record<string, UnitCategory> = {
  length: {
    name: 'Length',
    baseUnit: 'meter',
    units: [
      { name: 'millimeter', symbol: 'mm', toBase: 0.001, category: 'length' },
      { name: 'centimeter', symbol: 'cm', toBase: 0.01, category: 'length' },
      { name: 'meter', symbol: 'm', toBase: 1, category: 'length' },
      { name: 'kilometer', symbol: 'km', toBase: 1000, category: 'length' },
      { name: 'inch', symbol: 'in', toBase: 0.0254, category: 'length' },
      { name: 'foot', symbol: 'ft', toBase: 0.3048, category: 'length' },
      { name: 'yard', symbol: 'yd', toBase: 0.9144, category: 'length' },
      { name: 'mile', symbol: 'mi', toBase: 1609.344, category: 'length' }
    ]
  },
  weight: {
    name: 'Weight',
    baseUnit: 'kilogram',
    units: [
      { name: 'gram', symbol: 'g', toBase: 0.001, category: 'weight' },
      { name: 'kilogram', symbol: 'kg', toBase: 1, category: 'weight' },
      { name: 'pound', symbol: 'lb', toBase: 0.453592, category: 'weight' },
      { name: 'ounce', symbol: 'oz', toBase: 0.0283495, category: 'weight' },
      { name: 'stone', symbol: 'st', toBase: 6.35029, category: 'weight' }
    ]
  },
  temperature: {
    name: 'Temperature',
    baseUnit: 'celsius',
    units: [
      { name: 'celsius', symbol: '°C', toBase: 1, category: 'temperature' },
      { name: 'fahrenheit', symbol: '°F', toBase: 1, category: 'temperature' },
      { name: 'kelvin', symbol: 'K', toBase: 1, category: 'temperature' }
    ]
  },
  currency: {
    name: 'Currency',
    baseUnit: 'USD',
    units: [
      { name: 'USD', symbol: '$', toBase: 1, category: 'currency' },
      { name: 'EUR', symbol: '€', toBase: 0.85, category: 'currency' },
      { name: 'GBP', symbol: '£', toBase: 0.73, category: 'currency' },
      { name: 'JPY', symbol: '¥', toBase: 110, category: 'currency' }
    ]
  }
};

export class UnitConverter {
  /**
   * Convert value from one unit to another
   */
  convert(value: number, fromUnit: string, toUnit: string): number | null {
    const fromDef = this.findUnit(fromUnit);
    const toDef = this.findUnit(toUnit);
    
    if (!fromDef || !toDef || fromDef.category !== toDef.category) {
      return null;
    }
    
    // Special handling for temperature
    if (fromDef.category === 'temperature') {
      return this.convertTemperature(value, fromUnit, toUnit);
    }
    
    // Convert to base unit, then to target unit
    const baseValue = value * fromDef.toBase;
    return baseValue / toDef.toBase;
  }

  /**
   * Get all units for a category
   */
  getUnitsForCategory(category: string): UnitDefinition[] {
    return UNIT_CATEGORIES[category]?.units || [];
  }

  /**
   * Get unit definition by name or symbol
   */
  findUnit(unit: string): UnitDefinition | null {
    for (const category of Object.values(UNIT_CATEGORIES)) {
      const found = category.units.find(
        u => u.name === unit || u.symbol === unit
      );
      if (found) return found;
    }
    return null;
  }

  /**
   * Special temperature conversion handling
   */
  private convertTemperature(value: number, from: string, to: string): number {
    // Convert to Celsius first
    let celsius = value;
    if (from === 'fahrenheit') {
      celsius = (value - 32) * 5/9;
    } else if (from === 'kelvin') {
      celsius = value - 273.15;
    }
    
    // Convert from Celsius to target
    if (to === 'fahrenheit') {
      return celsius * 9/5 + 32;
    } else if (to === 'kelvin') {
      return celsius + 273.15;
    }
    
    return celsius;
  }
}

export const unitConverter = new UnitConverter();
