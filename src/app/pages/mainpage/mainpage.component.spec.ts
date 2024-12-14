import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainpageComponent } from './mainpage.component';

describe('MainpageComponent', () => {
  let component: MainpageComponent;
  let fixture: ComponentFixture<MainpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainpageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
