import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, Renderer2 } from '@angular/core';
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

  /** Container of all elements */
  @ViewChild('container') container: ElementRef;


  /**
   * Creates an instance of ViewerComponent.
   * @param {HttpService} httpService
   * @param {ActivatedRoute} route
   * @memberof ViewerComponent
   */
  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private renderer: Renderer2) { }

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
          this.parseData(res[0].data);
        },
        err => {
          console.log(err);
        }
      );
  }

  private parseData(data: any) {
    for (let i = 0; i < data.length; i++) {
      const tagName = data[i].tagName;
      switch (tagName) {
        case 'title':
          this.createTitle(data[i].value);
          break;
        case 'text':
          this.createContent(data[i].html);
          break;
        case 'code':
          this.createCode(data[i].html);
          break;
        case 'img':
          this.createImage(data[i].src, data[i].original);
          break;
        case 'video':
          this.createVideo(data[i].src);
          break;
        default:
          console.log('INVALID TAG');
      }
    }
  }

  private createTitle(value: string) {
    const div = document.createElement('div');
    this.renderer.addClass(div, 'title');
    div.innerText = value;
    this.renderer.appendChild(this.container.nativeElement, div);
  }

  private createContent(html: string) {
    const div = document.createElement('div');
    this.renderer.addClass(div, 'content');
    div.innerHTML = html;
    this.renderer.appendChild(this.container.nativeElement, div);
  }

  private createCode(html: string) {
    const div = document.createElement('div');
    this.renderer.addClass(div, 'content');
    this.renderer.addClass(div, 'codeContainer');
    div.innerHTML = html;
    this.renderer.appendChild(this.container.nativeElement, div);
  }

  private createImage(src: string, original: boolean) {
    const div = document.createElement('div');
    const img = document.createElement('img');

    this.renderer.addClass(div, 'imageContainer');
    this.renderer.setAttribute(img, 'src', src);

    if (original) {
      this.renderer.addClass(img, 'image');
    }
    this.renderer.appendChild(div, img);

    this.renderer.appendChild(this.container.nativeElement, div);
  }

  private createVideo(src: string) {
    const div = document.createElement('div');
    const video = document.createElement('iframe');

    this.renderer.addClass(div, 'videoContainer');
    this.renderer.setAttribute(video, 'src', src);
    this.renderer.setAttribute(video, 'frameborder', '0');
    this.renderer.addClass(video, 'video');
    this.renderer.appendChild(div, video);

    this.renderer.appendChild(this.container.nativeElement, div);
  }

}
