import { Injectable } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CATEGORY, INTERVAL, RemindAT, Task } from '../task-wrapper/models/task';
import { UTILITY } from '../task-wrapper/utilities/utility';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  currentTaskId: string;
  taskFormGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.currentTaskId = UTILITY.GenerateUUID();
    this.taskFormGroup = this.fb.group({
      id: [null],
      taskId: this.currentTaskId,
      title: [''],
      subtasks: this.fb.array([])
    });
  }

  // getter for easier access
  get subtasksFormArr(): FormArray {
    return this.taskFormGroup.get('subtasks') as FormArray;
  }

  addSubtask() {
    this.subtasksFormArr.push(
      this.fb.group({
        id: [UTILITY.GenerateUUID()],
        subtitle: ['', Validators.required],
        completed: [false, Validators.required],
        taskId: [this.currentTaskId, Validators.required]
      })
    );
  }

  deleteSubtask(index: number) {
    this.subtasksFormArr.removeAt(index);
  }
}
