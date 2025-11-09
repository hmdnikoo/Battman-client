import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotDetailsComponent } from './robot-details-component';

describe('RobotDetailsComponent', () => {
  let component: RobotDetailsComponent;
  let fixture: ComponentFixture<RobotDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RobotDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RobotDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
