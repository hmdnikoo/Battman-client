import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TabList, TabPanels, TabPanel, TabsModule } from 'primeng/tabs';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { DrawerModule } from 'primeng/drawer';
import { SplitterModule } from 'primeng/splitter';
import { UIChart } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    ProgressBarModule,
    TableModule,
    TabsModule,
    TabList,
    TabsModule,
    TabPanels,
    TabPanel,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    ConfirmDialogModule,
    ToastModule,
    SelectModule,
    TextareaModule,
    DrawerModule,
    SplitterModule,
    UIChart,
    PanelModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    ProgressBarModule,
    TableModule,
    TabsModule,
    TabList,
    TabsModule,
    TabPanels,
    TabPanel,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    ConfirmDialogModule,
    ToastModule,
    SelectModule,
    TextareaModule,
    DrawerModule,
    SplitterModule,
    UIChart,
    PanelModule
  ]
})
export class PrimengSharedModule { }
