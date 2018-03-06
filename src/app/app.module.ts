import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { CreatorComponent } from './creator/creator.component';

import { HttpService } from './core/http/http.service';
import { ViewerComponent } from './viewer/viewer.component';
import { BlogComponent } from './blog/blog.component';

@NgModule({
  declarations: [
    AppComponent,
    CreatorComponent,
    ViewerComponent,
    BlogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: '', component: BlogComponent
      },
      {
        path: 'creator', component: CreatorComponent
      },
      {
        path: 'creator/:id', component: CreatorComponent
      },
      {
        path: 'viewer/:id', component: ViewerComponent
      }
    ])
  ],
  providers: [HttpService, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
