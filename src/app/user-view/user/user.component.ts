import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../common/services/user.service';
import { IUser } from '../../common/interfaces/user';

@Component({
  selector: 'blog-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private userService: UserService) { }
  @Input() id: number;

  user$: Observable<IUser>;

  ngOnInit() {
    this.user$ = this.userService.getUser(this.id);
  }

}