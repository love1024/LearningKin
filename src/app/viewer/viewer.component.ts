import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../core/http/http.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewerComponent implements OnInit {

  /**
   * Id of the blog which this component is showing
   *
   * @type {string}
   * @memberof ViewerComponent
   */
  id: string;

  /**
   * body of the blog where all the content will go
   *
   * @type {ElementRef}
   * @memberof ViewerComponent
   */
  @ViewChild('body') body: ElementRef;


  /**
   * Creates an instance of ViewerComponent.
   * @param {HttpService} httpService
   * @param {ActivatedRoute} route
   * @memberof ViewerComponent
   */
  constructor(private httpService: HttpService, private route: ActivatedRoute) { }

  /**
   * Get the id of blog and get that blog from server
   *
   * @memberof ViewerComponent
   */
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.httpService.getById(this.id)
      .subscribe(
      res => {
        console.log(res);
        this.body.nativeElement.innerHTML = res[0].content;
      },
      err => {
        console.log(err);
      }
      );
  }

}
