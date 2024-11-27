import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefListComponent } from './chef-list.component';

describe('ChefListComponent', () => {
  let component: ChefListComponent;
  let fixture: ComponentFixture<ChefListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChefListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChefListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
