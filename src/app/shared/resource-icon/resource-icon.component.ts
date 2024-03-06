import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-resource-icon',
  templateUrl: './resource-icon.component.html',
  styleUrls: ['./resource-icon.component.scss']
})
export class ResourceIconComponent implements OnInit {

  @Input() resource = '';

  constructor() { }

  ngOnInit(): void {  }

}
