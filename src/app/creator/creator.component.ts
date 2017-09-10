import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss']
})
export class CreatorComponent implements OnInit {

  @ViewChild('content') content: ElementRef;

  constructor(private _renderer: Renderer2) { }

  ngOnInit() {
  }

  // Auto grow the title and content div
  autoGrow(el) {
    // Increase Height according to input
    if (el.scrollHeight > el.clientHeight) {
      el.style.height = (el.scrollHeight + 50) + 'px';
    } else {
      // Prevent height from growing when deleting lines.
      el.style.height = '1px';
      el.style.height = el.scrollHeight + 'px';
    }
  }

  // Format text according to the command
  formatText(cmd: string) {
    document.execCommand(cmd, false, null);
  }
  // https://scontent.fdel3-1.fna.fbcdn.net/v/t1.0-9/1230002_1391455327751947_73356302_n.jpg?oh=0867b698933ca57f49283d09a2140e42&oe=5A4D1E2A
  insertImage() {

    // Insert new Image Element using renderer2
    const link = window.prompt('Insert link of the image');
    const el = this._renderer.createElement('img');
    this._renderer.addClass(el, 'image');
    this._renderer.setAttribute(el, 'src', link);
    this._renderer.appendChild(this.content.nativeElement, el);

    // Insert next editable box to add more content
    const el1 = this._renderer.createElement('div');
    this._renderer.addClass(el1, 'content');
    this._renderer.setAttribute(el1, 'contentEditable', 'true');
    this._renderer.setAttribute(el1, 'placeholder', 'Add Extra Content...');
    this._renderer.appendChild(this.content.nativeElement, el1);
  }

}
