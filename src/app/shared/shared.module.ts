import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from './card/card.component';
import { CardImageComponent } from './card-image/card-image.component';
import { ResourceIconComponent } from './resource-icon/resource-icon.component';
import { ToastComponent } from './toast/toast.component';

@NgModule({
  declarations: [
    CardComponent,
    CardImageComponent,
    ResourceIconComponent,
    ToastComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  exports: [
    CardComponent,
    CardImageComponent,
    ResourceIconComponent,
    ToastComponent
  ]
})
export class SharedModule { }
