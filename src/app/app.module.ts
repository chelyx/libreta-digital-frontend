import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { AuthModule } from '@auth0/auth0-angular';
import { HttpClientModule } from '@angular/common/http';

// Remove the dynamic assignment and use a string literal for redirect_uri
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatButtonModule,
    AuthModule.forRoot({
      domain: 'dev-7tciizrz7pk84r8q.us.auth0.com',
      clientId: '0mGm99P2Jv3LhUKXOWPGDcYrhn3upEdg',
      authorizationParams: {
        redirect_uri: 'http://localhost:4200',
        audience: 'http://localhost:8080',
    }}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
