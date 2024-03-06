import {
  ViewportScroller
} from '@angular/common';
import {
  Component,
  HostListener,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  smallScreen: boolean = false;
  pageYoffset = 0;
  @HostListener('window:scroll', ['$event']) onScroll() {
    this.pageYoffset = window.pageYOffset;
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);
  }

  constructor(private scroll: ViewportScroller) {}

  ngOnInit(): void {}
}
