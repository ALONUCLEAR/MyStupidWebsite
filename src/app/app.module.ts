import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ListShufflingComponent } from './pages/list-shuffling/list-shuffling.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PianoComponent } from './pages/piano/piano.component';
import { TouchClickDirective } from './directives/touch-click.directive';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    ListShufflingComponent,
    PianoComponent,
    TouchClickDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    DragDropModule,
    MatSlideToggleModule,
    MatSelectModule
  ],
  providers: [],
  exports: [TouchClickDirective],
  bootstrap: [AppComponent]
})
export class AppModule { }
