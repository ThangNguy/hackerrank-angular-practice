import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ConversionUnit {
  name: string;
  symbol: string;
  toBase: number; // Conversion factor to base unit
}

interface UnitCategory {
  name: string;
  baseUnit: string;
  units: ConversionUnit[];
}

@Component({
  selector: 'app-unit-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './unit-converter.component.html',
  styleUrl: './unit-converter.component.scss'
})
export class UnitConverterComponent {
  categories: UnitCategory[] = [
    {
      name: 'Length',
      baseUnit: 'meter',
      units: [
        { name: 'Millimeter', symbol: 'mm', toBase: 0.001 },
        { name: 'Centimeter', symbol: 'cm', toBase: 0.01 },
        { name: 'Meter', symbol: 'm', toBase: 1 },
        { name: 'Kilometer', symbol: 'km', toBase: 1000 },
        { name: 'Inch', symbol: 'in', toBase: 0.0254 },
        { name: 'Foot', symbol: 'ft', toBase: 0.3048 },
        { name: 'Yard', symbol: 'yd', toBase: 0.9144 },
        { name: 'Mile', symbol: 'mi', toBase: 1609.34 }
      ]
    },
    {
      name: 'Weight',
      baseUnit: 'kilogram',
      units: [
        { name: 'Milligram', symbol: 'mg', toBase: 0.000001 },
        { name: 'Gram', symbol: 'g', toBase: 0.001 },
        { name: 'Kilogram', symbol: 'kg', toBase: 1 },
        { name: 'Ton', symbol: 't', toBase: 1000 },
        { name: 'Ounce', symbol: 'oz', toBase: 0.0283495 },
        { name: 'Pound', symbol: 'lb', toBase: 0.453592 }
      ]
    },
    {
      name: 'Temperature',
      baseUnit: 'celsius',
      units: [
        { name: 'Celsius', symbol: '°C', toBase: 1 },
        { name: 'Fahrenheit', symbol: '°F', toBase: 1 },
        { name: 'Kelvin', symbol: 'K', toBase: 1 }
      ]
    }
  ];

  selectedCategory: UnitCategory = this.categories[0];
  fromUnit: ConversionUnit = this.selectedCategory.units[2]; // Meter
  toUnit: ConversionUnit = this.selectedCategory.units[3]; // Kilometer
  inputValue: number = 1;
  result: number = 0;

  ngOnInit() {
    this.convert();
  }

  onCategoryChange() {
    this.fromUnit = this.selectedCategory.units[0];
    this.toUnit = this.selectedCategory.units[1];
    this.convert();
  }

  convert() {
    if (this.selectedCategory.name === 'Temperature') {
      this.result = this.convertTemperature();
    } else {
      // Convert to base unit first, then to target unit
      const baseValue = this.inputValue * this.fromUnit.toBase;
      this.result = baseValue / this.toUnit.toBase;
    }
    
    // Round to 6 decimal places
    this.result = Math.round(this.result * 1000000) / 1000000;
  }

  private convertTemperature(): number {
    let celsius: number;
    
    // Convert from input to Celsius
    if (this.fromUnit.symbol === '°C') {
      celsius = this.inputValue;
    } else if (this.fromUnit.symbol === '°F') {
      celsius = (this.inputValue - 32) * 5/9;
    } else { // Kelvin
      celsius = this.inputValue - 273.15;
    }

    // Convert from Celsius to output
    if (this.toUnit.symbol === '°C') {
      return celsius;
    } else if (this.toUnit.symbol === '°F') {
      return (celsius * 9/5) + 32;
    } else { // Kelvin
      return celsius + 273.15;
    }
  }

  swapUnits() {
    const temp = this.fromUnit;
    this.fromUnit = this.toUnit;
    this.toUnit = temp;
    this.convert();
  }
}
