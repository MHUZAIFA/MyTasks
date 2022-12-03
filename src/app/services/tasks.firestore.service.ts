
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Task } from '../task-wrapper/models/task';
import { User } from '../task-wrapper/models/user';

export enum Collections {
  TasksStore = 'tasksStore',
  Tasks = 'tasks'

}

@Injectable({
  providedIn: 'root'
})
export class TasksFirestoreService {

  get user(): User { return JSON.parse(localStorage.getItem('user') as string) as User; }

  constructor(private _firestore: AngularFirestore) { }

  tasksListUpdatedAvailable() { return this._firestore.collection(Collections.TasksStore).doc(this.user.uid).collection(Collections.Tasks).valueChanges(); }
  taskUpdatedAvailable(taskId: string) : Observable<any> { return this._firestore.collection(Collections.TasksStore).doc(this.user.uid).collection(Collections.Tasks).doc(taskId).valueChanges() as Observable<any>; }

  getTasks() { return this._firestore.collection(Collections.TasksStore).doc(this.user.uid).collection(Collections.Tasks).ref.get(); }
  getTaskById(id: string) { return this._firestore.collection(Collections.TasksStore).doc(this.user.uid).collection(Collections.Tasks).ref.where('id', '==', id).get(); }
  createTask(task: Task) { return this._firestore.collection(Collections.TasksStore).doc(this.user.uid).collection(Collections.Tasks).add(JSON.parse(JSON.stringify(task))); }
  updateTask(task: Task) { return this._firestore.collection(Collections.TasksStore).doc(this.user.uid).collection(Collections.Tasks).doc(task.id).set(JSON.parse(JSON.stringify(task)), { merge: true }); }
  deleteTask(id: string) { return this._firestore.collection(Collections.TasksStore).doc(this.user.uid).collection(Collections.Tasks).doc(id).delete(); }

}
