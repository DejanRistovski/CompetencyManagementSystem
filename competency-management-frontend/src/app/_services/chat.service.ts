import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Message} from "../_model/message.model";

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    chat(topicId: string | null, msg: Message): Observable<string> {
        return new Observable(observer => {
            fetch(`http://localhost:8080/${topicId}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify(msg)
            }).then(response => {
                const reader = response.body!.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                function read() {
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            observer.complete();
                            return;
                        }

                        buffer += decoder.decode(value, { stream: true });

                        let parts = buffer.split('\n\n');
                        buffer = parts.pop()!;

                        for (const part of parts) {
                            const lines = part.split('\n').filter(line => line.startsWith('data:'));
                            const message = lines.map(line => line.replace(/^data:/, '')).join('\n');
                            if (message) observer.next(message);
                        }

                        read();
                    });
                }

                read();
            });
        });
    }

}
