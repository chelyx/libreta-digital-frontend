import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatButtonModule } from '@angular/material/button';
import { AuthModule } from '@auth0/auth0-angular';
import { HttpClientModule } from '@angular/common/http';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {MatListModule} from '@angular/material/list';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import { CodeGeneratorComponent } from './code-generator/code-generator.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    CodeGeneratorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatListModule,
    FormsModule,
    MatIconModule,
    AuthModule.forRoot({
      domain: 'dev-7tciizrz7pk84r8q.us.auth0.com',
      clientId: '0mGm99P2Jv3LhUKXOWPGDcYrhn3upEdg',
      authorizationParams: {
        redirect_uri: 'http://localhost:4200',
        audience: 'http://localhost:8080',
        scope: 'openid profile email'
    }}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

   constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIcon(
      'logo',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/logo.svg')
    );
    matIconRegistry.registerFontClassAlias('material-symbols-outlined', 'material-symbols-outlined');
    matIconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }
 }
