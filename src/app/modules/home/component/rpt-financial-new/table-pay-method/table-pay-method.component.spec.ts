import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePayMethodComponent } from './table-pay-method.component';

describe('TablePayMethodComponent', () => {
  let component: TablePayMethodComponent;
  let fixture: ComponentFixture<TablePayMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablePayMethodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablePayMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
