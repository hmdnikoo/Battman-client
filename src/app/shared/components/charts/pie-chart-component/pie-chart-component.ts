import { ChangeDetectorRef, Component, effect, inject, Input, input, OnInit, PLATFORM_ID } from '@angular/core';
import { AppConfigService } from '../../../services/app-config-service';
import { DesignerService } from '../../../services/designer-service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UIChart } from "primeng/chart";
import { CardModule } from 'primeng/card';

@Component({
  selector: 'pie-chart',
  imports: [UIChart, CardModule, CommonModule],
  templateUrl: './pie-chart-component.html',
  styleUrl: './pie-chart-component.scss'
})
export class PieChartComponent implements OnInit{
  @Input() data: any = {};

  @Input() title:string = "Pie Chart";

    options: any;

    platformId = inject(PLATFORM_ID);

    configService = inject(AppConfigService);

    designerService = inject(DesignerService);

    constructor(private cd: ChangeDetectorRef) {}

    themeEffect = effect(() => {
        if (this.configService.transitionComplete()) {
            if (this.designerService.preset()) {
                this.initChart();
            }
        }
    });

    ngOnInit() {
        this.initChart();
    }

    initChart() {
        if (isPlatformBrowser(this.platformId)) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');

            // this.data = {
            //     labels: ['A', 'B', 'C'],
            //     datasets: [
            //         {
            //             data: [540, 325, 702],
            //             backgroundColor: [documentStyle.getPropertyValue('--p-cyan-500'), documentStyle.getPropertyValue('--p-orange-500'), documentStyle.getPropertyValue('--p-gray-500')],
            //             hoverBackgroundColor: [documentStyle.getPropertyValue('--p-cyan-400'), documentStyle.getPropertyValue('--p-orange-400'), documentStyle.getPropertyValue('--p-gray-400')]
            //         }
            //     ]
            // };

            this.options = {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                            color: textColor
                        }
                    }
                }
            };
            this.cd.markForCheck()
        }

    }

}
