import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/shared-module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-robot-details-component',
  imports: [SharedModule],
  templateUrl: './robot-details-component.html',
  styleUrl: './robot-details-component.scss'
})
export class RobotDetailsComponent implements OnInit {
  selectedRobot: string | null = null;
  constructor(private route: ActivatedRoute){}
ngOnInit(): void {
  this.selectedRobot = this.route.snapshot.paramMap.get('id');
}

}
