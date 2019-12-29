import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { List } from 'src/app/models/list.model';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit {

  constructor(private taskServive: TaskService, private router: Router) { }

  ngOnInit() {
  }
  createList(name:any){
    return this.taskServive.createList(name).subscribe((list:List)=> {
      console.log(list);

      this.router.navigate([ './', list._id ]); 
    });
  }

  refresh(): void {
    window.location.reload();
}

}
