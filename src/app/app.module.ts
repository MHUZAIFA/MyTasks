import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskWrapperComponent } from './task-wrapper/task-wrapper.component';
import { GreetingComponent } from './task-wrapper/greeting/greeting.component';
import { StatsComponent } from './task-wrapper/stats/stats.component';
import { ProgressComponent } from './task-wrapper/progress/progress.component';
import { TaskListWrapperComponent } from './task-wrapper/task-list-wrapper/task-list-wrapper.component';
import { TaskListHeaderComponent } from './task-wrapper/task-list-wrapper/task-list-header/task-list-header.component';
import { TaskListComponent } from './task-wrapper/task-list-wrapper/task-list/task-list.component';
import { TaskListUnitComponent } from './task-wrapper/task-list-wrapper/task-list/task-list-unit/task-list-unit.component';
import { CreateTaskComponent } from './task-wrapper/create-task/create-task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubtaskUnitComponent } from './task-wrapper/subtask-unit/subtask-unit.component';
import { MaterialModule } from './material.module';
import { TaskMetadataComponent } from './task-wrapper/task-metadata/task-metadata.component';
import { MatTimepickerModule } from 'mat-timepicker';
import { ReminderComponent } from './task-wrapper/reminder/reminder.component';
import { RepeatComponent } from './task-wrapper/repeat/repeat.component';
import { TaskDetailsComponent } from './task-wrapper/task-details/task-details.component';
import { TaskNotesComponent } from './task-wrapper/task-details/task-notes/task-notes.component';
import { MetadataUnitComponent } from './task-wrapper/task-metadata/metadata-unit/metadata-unit.component';
import { AutoFocusDirective } from './task-wrapper/directives/autofocus.directive';
import { HttpClientModule } from '@angular/common/http';
import { TimePickerComponent } from './task-wrapper/time-picker/time-picker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AreaChartComponent } from './task-wrapper/components/area-chart/area-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GaugeChartComponent } from './task-wrapper/components/gauge-chart/gauge-chart.component';
import { LandingModule } from './landing/landing.module';
import { AuthModule } from './auth/auth.module';
import { DynamicComponentRefDirective } from './task-wrapper/dynamic-component-ref.directive';
import { NoTasksComponent } from './task-wrapper/no-tasks/no-tasks.component';
import { SettingsComponent } from './settings/settings.component';
import { AlertComponent } from './task-wrapper/task-details/alert/alert.component';
import { SettingsUnitComponent } from './settings/settings-unit/settings-unit.component';
import { DashboardComponent } from './task-wrapper/dashboard/dashboard.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { TaskSearchComponent } from './task-wrapper/task-search/task-search.component';
import { OfflineComponent } from './offline/offline.component';
import { TaskDetailsDefaultComponent } from './task-wrapper/task-details/task-details-default/task-details-default.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskWrapperComponent,
    GreetingComponent,
    StatsComponent,
    ProgressComponent,
    TaskListWrapperComponent,
    TaskListHeaderComponent,
    TaskListComponent,
    TaskListUnitComponent,
    CreateTaskComponent,
    SubtaskUnitComponent,
    TaskMetadataComponent,
    MetadataUnitComponent,
    ReminderComponent,
    RepeatComponent,
    TaskDetailsComponent,
    TaskDetailsDefaultComponent,
    TaskNotesComponent,
    AutoFocusDirective,
    TimePickerComponent,
    AreaChartComponent,
    GaugeChartComponent,
    NoTasksComponent,
    DynamicComponentRefDirective,
    SettingsComponent,
    AlertComponent,
    SettingsUnitComponent,
    DashboardComponent,
    TaskSearchComponent,
    OfflineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatTimepickerModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgxChartsModule,
    LandingModule,
    AuthModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
