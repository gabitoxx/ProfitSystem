import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCredentialsComponent } from './request-credentials.component';

describe('RequestCredentialsComponent', () => {
  let component: RequestCredentialsComponent;
  let fixture: ComponentFixture<RequestCredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestCredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
