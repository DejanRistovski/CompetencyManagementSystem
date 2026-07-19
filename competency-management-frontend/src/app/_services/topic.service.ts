import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {GlobalVariables} from "../_helpers/globalVariables";
import {Topic} from "../_model/topic.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  constructor(private http: HttpClient) {
  }

  getTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(GlobalVariables.backendBaseUrl + '/topics');
  }

  getTopic(topicId: string): Observable<Topic> {
    return this.http.get<Topic>(GlobalVariables.backendBaseUrl + '/topics/' + topicId);
  }

  createTopic(topic: Topic): Observable<Topic> {
    return this.http.post<Topic>(GlobalVariables.backendBaseUrl + '/topics', topic);
  }

  watchTopic(topicId: string): Observable<Topic> {
    return new Observable(observer => {
      const eventSource = new EventSource(`http://localhost:8080/topics/${topicId}/events`);


      eventSource.addEventListener("topic-update", (event: any) => {
        observer.next(JSON.parse(event.data));
      });

      eventSource.onerror = (err) => {
        console.error('SSE error', err);
        eventSource.close();
        observer.error(err);
      };

      return () => eventSource.close();
    });
  }
}
