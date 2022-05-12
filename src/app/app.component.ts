import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cerebroUI';
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ){
    this.matIconRegistry.addSvgIcon(
      "resource-energy",
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/resource/energy.svg')
    ),
    this.matIconRegistry.addSvgIcon(
      "resource-mental",
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/resource/mental.svg')
    ),
    this.matIconRegistry.addSvgIcon(
      "resource-physical",
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/resource/physical.svg')
    ),
    this.matIconRegistry.addSvgIcon(
      "resource-wild",
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/resource/wild.svg')
    )
  }
}
