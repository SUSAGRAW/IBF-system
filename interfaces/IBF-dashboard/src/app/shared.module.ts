import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsModule } from './analytics/analytics.module';
import { AboutBtnComponent } from './components/about-btn/about-btn.component';
import { AdminLevelComponent } from './components/admin-level/admin-level.component';
import { AggregatesComponent } from './components/aggregates/aggregates.component';
import { AreasOfFocusSummaryComponent } from './components/areas-of-focus-summary/areas-of-focus-summary.component';
import { ChatComponent } from './components/chat/chat.component';
import { CountrySwitcherComponent } from './components/country-switcher/country-switcher.component';
import { DateButtonComponent } from './components/date-button/date-button.component';
import { DialogueTurnComponent } from './components/dialogue-turn/dialogue-turn.component';
import { DisasterTypeComponent } from './components/disaster-type/disaster-type.component';
import { ExportViewPopoverComponent } from './components/export-view-popover/export-view-popover.component';
import { ExportViewComponent } from './components/export-view/export-view.component';
import { LayerControlInfoPopoverComponent } from './components/layer-control-info-popover/layer-control-info-popover.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LogosComponent } from './components/logos/logos.component';
import { MapControlsComponent } from './components/map-controls/map-controls.component';
import { MapComponent } from './components/map/map.component';
import { MatrixComponent } from './components/matrix/matrix.component';
import { SourceInfoModalComponent } from './components/source-info-modal/source-info-modal.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { TimestampComponent } from './components/timestamp/timestamp.component';
import { UserStateComponent } from './components/user-state/user-state.component';
import { VideoGuideButtonComponent } from './components/video-guide-button/video-guide-button.component';
import { VideoPopoverComponent } from './components/video-popover/video-popover.component';
import { BackendMockScenarioComponent } from './mocks/backend-mock-scenario-component/backend-mock-scenario.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeafletModule,
    LeafletMarkerClusterModule,
    TranslateModule,
    AnalyticsModule,
  ],
  declarations: [
    LoginFormComponent,
    MapComponent,
    MatrixComponent,
    TimelineComponent,
    AggregatesComponent,
    BackendMockScenarioComponent,
    ChatComponent,
    SourceInfoModalComponent,
    UserStateComponent,
    TimestampComponent,
    CountrySwitcherComponent,
    LogosComponent,
    AboutBtnComponent,
    DialogueTurnComponent,
    AreasOfFocusSummaryComponent,
    LayerControlInfoPopoverComponent,
    MapControlsComponent,
    AdminLevelComponent,
    ExportViewComponent,
    ExportViewPopoverComponent,
    DateButtonComponent,
    VideoPopoverComponent,
    VideoGuideButtonComponent,
    DisasterTypeComponent,
  ],
  exports: [
    LoginFormComponent,
    MapComponent,
    MatrixComponent,
    TimelineComponent,
    AggregatesComponent,
    ChatComponent,
    SourceInfoModalComponent,
    UserStateComponent,
    TimestampComponent,
    CountrySwitcherComponent,
    BackendMockScenarioComponent,
    LogosComponent,
    AboutBtnComponent,
    DialogueTurnComponent,
    AreasOfFocusSummaryComponent,
    LayerControlInfoPopoverComponent,
    MapControlsComponent,
    AdminLevelComponent,
    ExportViewComponent,
    ExportViewPopoverComponent,
    DateButtonComponent,
    VideoPopoverComponent,
    VideoGuideButtonComponent,
    DisasterTypeComponent,
    TranslateModule,
  ],
})
export class SharedModule {}
