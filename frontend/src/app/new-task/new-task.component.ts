import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Task } from 'src/app/models/task.model';


@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
  
})
export class NewTaskComponent implements OnInit {

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  listId: string;

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) =>{
        this.listId = params['listId'];
      }
    )
  }

  createTask(text:string){
    return this.taskService.createTask(text, this.listId).subscribe((task:Task)=> {
      console.log(task);
      this.router.navigate(['../'], { relativeTo: this.route});
    });
  }

}
