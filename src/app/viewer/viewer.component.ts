import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpService } from '../core/http/http.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  @ViewChild('body') body: ElementRef;

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.httpService.getAll().subscribe(
      (blogs) => {
        const body = this.body.nativeElement as HTMLElement;
        body.innerHTML = blogs[0].content;
        console.log(body.innerHTML);
      },
      err => {
        console.log(err);
      });
  }

}
