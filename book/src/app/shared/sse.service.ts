import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor(public _ngZone:NgZone) { }

  observeStream(sseUrl:string):Observable<any>{
    const eventSource = new EventSource(sseUrl);
    return new Observable(observer=>{
      eventSource.onmessage = event=>{
        this._ngZone.run(()=>observer.next(event.data));
      }
    });
  }
}
