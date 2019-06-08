import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingsComponent } from './tradings.component';

describe('TradingsComponent', () => {
  let component: TradingsComponent;
  let fixture: ComponentFixture<TradingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
