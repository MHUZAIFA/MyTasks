import { SubTask, RepeatedTask, CATEGORY, INTERVAL, Task, Reminder, RemindAT, TaskMetaData } from "./models/task";
import { UTILITY } from "./utilities/utility";
const _ = require('lodash');

export abstract class BaseTask {
  public id: string;
  public taskId: string;
  public title: string;
  public subtasks: SubTask[];
  public category: CATEGORY;
  public dueDate: Date | null;
  public time: Date | null;
  public reminder: Reminder;
  public repeatedTask: RepeatedTask;
  public notes: string;
  public attachments: string[];
  public completed: boolean;
  public completedDate: Date | null;
  public uid: string;
  public original: Task;
  public createdDate: Date;
  public updatedDate: Date;
  public metadata: TaskMetaData;
  public isDeleted: boolean;

  constructor() {
    const date = new Date();
    this.id = '';
    this.taskId = '';
    this.title = '';
    this.subtasks = [];
    this.category = CATEGORY.NOCATEGORY;
    this.dueDate = null;
    this.time = null;
    this.reminder = new Reminder(false, RemindAT.FiveMinBefore);
    this.repeatedTask = new RepeatedTask(false, INTERVAL.NONE);
    this.notes = '';
    this.attachments = [];
    this.completed = false;
    this.completedDate = null;
    this.uid = '';
    this.createdDate = date;
    this.updatedDate = date;
    this.isDeleted = false;
    this.metadata = new TaskMetaData(null, null, new Reminder(false, RemindAT.FiveMinBefore), new RepeatedTask(false, INTERVAL.DAILY));
    this.original = this.getTaskInstance().clone();
  }

  reset() {
    const date = new Date();
    this.id = '';
    this.taskId = '';
    this.title = '';
    this.subtasks = [];
    this.category = CATEGORY.NOCATEGORY;
    this.dueDate = null;
    this.time = null;
    this.reminder = new Reminder(false, RemindAT.FiveMinBefore);
    this.repeatedTask = new RepeatedTask(false, INTERVAL.NONE);
    this.notes = '';
    this.attachments = [];
    this.completed = false;
    this.completedDate = null;
    this.uid = '';
    this.createdDate = date;
    this.updatedDate = date;
    this.isDeleted = false;
    this.metadata = new TaskMetaData(null, null, new Reminder(false, RemindAT.FiveMinBefore), new RepeatedTask(false, INTERVAL.DAILY));
    this.original = this.getTaskInstance().clone();
  }

  setTask(task: Task) {
    this.id = task.id;
    this.taskId = task.taskId;
    this.title = task.title;
    this.subtasks = JSON.parse(JSON.stringify(task.subtasks)) as SubTask[];
    this.category = task.category;
    this.dueDate = task.dueDate ? new Date(task.dueDate) : task.dueDate;
    this.time = task.time ? new Date(task.time) : task.time;
    this.reminder = new Reminder(task.reminder.isReminderOn, task.reminder.remindAt);
    this.repeatedTask = new RepeatedTask(task.repeatedTask.isRepeated, task.repeatedTask.interval);
    this.notes = task.notes;
    this.attachments = task.attachments;
    this.completed = task.completed;
    this.completedDate = task.completedDate;
    this.uid = task.uid;
    this.createdDate = task.createdDate;
    this.updatedDate = task.updatedDate;
    this.isDeleted = task.isDeleted;
    this.metadata = this.getMetadataInstance();
    this.original = this.getTaskInstance().clone();
  }

  getTaskInstance(): Task {
    const subtasks = this.subtasks.filter(s => s.subtitle.length > 0);
    this.subtasks = subtasks;
    return new Task(this.id, this.taskId, this.title, this.subtasks, this.category, this.dueDate, this.time, this.reminder, this.repeatedTask, this.notes, this.attachments, this.completed, this.completedDate, this.uid, this.createdDate, this.updatedDate, this.isDeleted);
  }

  getMetadataInstance(): TaskMetaData {
    return new TaskMetaData(this.dueDate, this.time, this.reminder, this.repeatedTask);
  }

  updateMetadata(metadata: TaskMetaData) {
    this.dueDate = metadata.dueDate ? new Date(metadata.dueDate) : null;
    this.time = metadata.time;
    this.reminder = metadata.reminder;
    this.repeatedTask = metadata.repeatedTask;
  }

  addSubtask(autofocus: boolean) {
    const subtask = new SubTask(UTILITY.GenerateUUID(), '', false, this.taskId);
    this.subtasks.push(subtask);
    setTimeout(() => {
      if (autofocus) {
        const inputElement = document.getElementById(subtask.id);
        if (inputElement) { inputElement.focus() }
      }
    }, 100);

  }

  deleteSubTask(id: string) {
    const index = this.subtasks.findIndex(s => s.id === id);
    if (index > -1) {
      this.subtasks.splice(index, 1);
    } else {
      console.error('Subtask not found');
    }
  }

  addAttachment(url: string) {
    this.attachments.push(url);
    this.attachments = [...this.attachments];
    console.log(this.attachments);
  }

  isEqual(task: Task): boolean {
    return this.id === task.id &&
      this.taskId === task.taskId &&
      this.title === task.title &&
      _.isEqual(this.subtasks, task.subtasks) &&
      this.category === task.category &&
      this.dueDate === task.dueDate &&
      this.time === task.time &&
      this.reminder && this.reminder.isEqual(task.reminder) &&
      this.repeatedTask.isEqual(task.repeatedTask) &&
      this.notes === task.notes &&
      UTILITY.IsSimilarArray(this.attachments, task.attachments) &&
      this.completed === task.completed &&
      this.uid === task.uid;
  }

}
