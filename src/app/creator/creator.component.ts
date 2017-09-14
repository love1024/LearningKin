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
    this.content.nativeElement.children[0].focus();
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
  formatText(cmd: string, view: string) {
    document.execCommand(cmd, false, view);
  }

  // Insert new Image Element using renderer2
  insertImage() {
    const link = window.prompt('Insert link of the image');

    const div = this._renderer.createElement('div');
    this._renderer.addClass(div, 'videoContainer');
    const img = this.createImageElement(link);
    const del = this.createDeleteElement();

    this._renderer.appendChild(div, del);
    this._renderer.appendChild(div, img);

    const cur = document.getSelection().anchorNode;
    this._renderer.insertBefore(this.content.nativeElement, div, cur.nextSibling);

    this.deleteEmptyContent();
    this.addNextEditableBox(cur.nextSibling);
  }

  // Insert new Video Element using renderer2
  insertVideo() {
    const link = window.prompt('Insert link of the video');

    const div = this._renderer.createElement('div');
    this._renderer.addClass(div, 'imageContainer');
    const video = this.createVideoElement(link);
    const del = this.createDeleteElement();
    this._renderer.appendChild(div, del);
    this._renderer.appendChild(div, video);

    const cur = document.getSelection().anchorNode;
    this._renderer.insertBefore(this.content.nativeElement, div, cur.nextSibling);

    this.deleteEmptyContent();
    this.addNextEditableBox(cur.nextSibling);
  }

  // Insert next editable box to add more content
  addNextEditableBox(el) {
    const div = this._renderer.createElement('div');
    this._renderer.addClass(div, 'content');
    this._renderer.setAttribute(div, 'contentEditable', 'true');

    // this._renderer.appendChild(this.content.nativeElement, div);
    this._renderer.insertBefore(this.content.nativeElement, div, el.nextSibling);
  }

  // To delete not used placeholders
  deleteEmptyContent() {
    const children = this.content.nativeElement.children;
    for (let i = 2; i < children.length; i++) {
      if (children[i].innerHTML === '' && children[i].tagName !== 'IMG') {
        // this.content.nativeElement.removeChild(children[i]);
      }
    }
  }

  // Create Image element
  createImageElement(link: string) {
    const el = this._renderer.createElement('img');
    this._renderer.addClass(el, 'image');
    this._renderer.setAttribute(el, 'src', link);
    this._renderer.listen(el, 'error', (e) => {
      e.srcElement.src = 'http://www.siennachicago.com/Common/images/jquery/galleria/image-not-found.png';
    });
    return el;
  }

  // Create Video Element to insert
  createVideoElement(link: string) {
    const video = this._renderer.createElement('iframe');

    const id = this.getVideoId(link);
    if (id === 'error') {
      alert('Please Add valid link');
      return;
    }

    link = 'https://www.youtube.com/embed/' + id;
    this._renderer.setAttribute(video, 'src', link);
    this._renderer.setAttribute(video, 'frameborder', '0');
    this._renderer.addClass(video, 'video');

    return video;
  }

  // Create Delete Image
  createDeleteElement() {
    const el = this._renderer.createElement('i');
    this._renderer.addClass(el, 'fa');
    this._renderer.addClass(el, 'fa-window-close');
    this._renderer.setAttribute(el, 'aria-hidden', 'true');

    // Remove the parent on click of this element
    this._renderer.listen(el, 'click', (e) => {
      const parent = this._renderer.parentNode(e.srcElement);
      this._renderer.removeChild(this.content.nativeElement, parent);
    });
    return el;
  }

  // Get video id from youtbube video link
  getVideoId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return match[2];
    } else {
      return 'error';
    }
  }

}
