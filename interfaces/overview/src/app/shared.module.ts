import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { IonicModule } from '@ionic/angular';
import { AboutBtnComponent } from './components/about-btn/about-btn.component';
import { AggregatesComponent } from './components/aggregates/aggregates.component';
import { AofSummaryComponent } from './components/aof-summary/aof-summary.component';
import { ChatComponent } from './components/chat/chat.component';
import { CountrySwitcherComponent } from './components/country-switcher/country-switcher.component';
import { DialogueTurnComponent } from './components/dialogue-turn/dialogue-turn.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LogosComponent } from './components/logos/logos.component';
import { MapComponent } from './components/map/map.component';
import { MatrixComponent } from './components/matrix/matrix.component';
import { SourceInfoModalComponent } from './components/source-info-modal/source-info-modal.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { TimestampComponent } from './components/timestamp/timestamp.component';
import { UserStateComponent } from './components/user-state/user-state.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, LeafletModule],
  declarations: [
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
    LogosComponent,
    AboutBtnComponent,
    DialogueTurnComponent,
    AofSummaryComponent,
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
    LogosComponent,
    AboutBtnComponent,
    DialogueTurnComponent,
    AofSummaryComponent,
  ],
})
export class SharedModule {}
