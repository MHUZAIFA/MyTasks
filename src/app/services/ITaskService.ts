import { Observable } from "rxjs";
import { Task } from "../task-wrapper/models/task";
import { SnackbarMessages } from "./snackbar.service";

export interface ITaskService {
  tasksListUpdatedAvailable(): Observable<any>
  taskUpdatedAvailable(taskId: string): Observable<any>
  getTasks(): Promise<Task[]> ;
  getTaskById(id: string): Promise<Task | undefined>;
  createTask(task: Task): Promise<string>;
  updatetask(task: Task, message: SnackbarMessages, vibrate: boolean): Promise<void>;
  deletetask(taskId: string): Promise<void>;
}
