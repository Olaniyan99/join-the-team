import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Task } from './models/task.model';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebRequestService ) { }

  getLists(){ // Web request to get List
    return this.webReqService.get('lists');
  }

  createList(name: string){ // Web request to create List
    return this.webReqService.post('lists', { name });
  }

  updateList(id: string, name: string) {
    // We want to send a web request to update a list
    return this.webReqService.patch(`lists/${id}`, { name });
  }

  deleteList(id: string) {
    return this.webReqService.delete(`lists/${id}`);
  }


  getTasks(listId: any){ // Web request to get Task
    return this.webReqService.get(`lists/${listId}/tasks`); 
  }

  createTask(text: string, listId: string){ // Web request to create a Task
    return this.webReqService.post(`lists/${listId}/tasks`, { text });
  }
  
  updateTask(listId: string, taskId: string, text: string) {
    // We want to send a web request to update a list
    return this.webReqService.patch(`lists/${listId}/tasks/${taskId}`, { text });
  }


  deleteTask(listId: string, taskId: string) {
    return this.webReqService.delete(`lists/${listId}/tasks/${taskId}`);
  }

  complete(task: Task) {
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }
}
