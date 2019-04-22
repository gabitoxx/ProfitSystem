import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTradingComponent } from './create-trading.component';

describe('CreateTradingComponent', () => {
  let component: CreateTradingComponent;
  let fixture: ComponentFixture<CreateTradingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTradingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
