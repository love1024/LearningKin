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
    const id = this.route.snapshot.paramMap.get('id');
    this.httpService.getById(id)
      .subscribe(
      res => {
        this.body.nativeElement.innerHTML = this.RemoveExtras(res[0].content, res[0].titleText);
      },
      err => {
        console.log(err);
      }
      );
  }

  /**
   *  Replace everything unnecessary with blank
   *  such as contenteditable and or remove content
   *  buttons
   *
   * @param {string} content
   * @memberof CreatorComponent
   */
  RemoveExtras(content: string, titleText: string): string {
    content = content.replace('</textarea>', titleText + '</textarea>');
    content = content.replace(/textarea/g, 'div');
    content = content.replace(/contenteditable="true"/g, '');

    // Removing font awesome close icons
    // Removing empty divs
    const wrapper = document.createElement('div');
    wrapper.innerHTML = content;

    const icons = wrapper.getElementsByTagName('i');
    while (icons.length > 0) {
      icons[0].parentNode.removeChild(icons[0]);
    }

    const divs = wrapper.getElementsByClassName('content') as any;
    for (const div of divs) {
      if (div.innerText === '') {
        div.remove();
      }
    }
    content = wrapper.innerHTML;

    return content;
  }


}
