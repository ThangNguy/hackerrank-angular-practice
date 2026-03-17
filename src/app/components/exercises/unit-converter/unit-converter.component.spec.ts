import { TestBed } from '@angular/core/testing';
import { UnitConverterComponent } from './unit-converter.component';

describe('UnitConverterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitConverterComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UnitConverterComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
