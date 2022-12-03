export class TaskMetaData {
  dueDate: Date | null;
  time: Date | null;
  reminder: Reminder;
  repeatedTask: RepeatedTask;

  constructor(dueDate: Date | null,
    time: Date | null,
    reminder: Reminder,
    repeatedTask: RepeatedTask) {
    this.dueDate = dueDate;
    this.time = time;
    this.reminder = reminder;
    this.repeatedTask = repeatedTask;
  }

  isEqual(metadata: TaskMetaData): boolean {
    return this.dueDate === metadata.dueDate &&
      this.time === metadata.time &&
      this.reminder === metadata.reminder &&
      this.repeatedTask === metadata.repeatedTask;
  }
}

export class Task extends TaskMetaData {
  id: string;
  taskId: string;
  title: string;
  subtasks: SubTask[];
  category: CATEGORY;
  notes: string;
  attachments: string[];
  completed: boolean;
  completedDate: Date | null;
  uid: string;
  createdDate: Date;
  updatedDate: Date;

  constructor(
    id: string,
    taskId: string,
    title: string,
    subtasks: SubTask[],
    category: CATEGORY,
    dueDate: Date | null,
    time: Date | null,
    reminder: Reminder,
    repeatedTask: RepeatedTask,
    notes: string,
    attachments: string[],
    completed: boolean,
    completedDate: Date | null,
    uid: string,
    createdDate: Date,
    updatedDate: Date) {
    super(dueDate, time, reminder, repeatedTask);
    this.id = id;
    this.taskId = taskId;
    this.title = title;
    this.subtasks = JSON.parse(JSON.stringify(subtasks)) as SubTask[];;
    this.category = category;
    this.notes = notes;
    this.attachments = attachments;
    this.completed = completed;
    this.completedDate = completedDate;
    this.uid = uid;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }

  public clone(): Task {
    return new Task(this.id, this.taskId, this.title, this.subtasks, this.category, this.dueDate, this.time, this.reminder, this.repeatedTask, this.notes, this.attachments, this.completed, this.completedDate, this.uid, this.createdDate, this.updatedDate);
  }
}

export class SubTask {
  id: string;
  subtitle: string;
  completed: boolean;
  taskId: string;

  constructor(id: string,
    subtitle: string,
    completed: boolean,
    taskId: string) {
    this.id = id;
    this.subtitle = subtitle;
    this.completed = completed;
    this.taskId = taskId;
  }

  isEqual(subtask: SubTask | undefined): boolean {
    return !!subtask && this.id === subtask.id &&
      this.subtitle === subtask.subtitle &&
      this.completed === subtask.completed &&
      this.taskId === subtask.taskId;
  }
}

export class RepeatedTask {
  isRepeated: boolean;
  interval: INTERVAL;

  constructor(isRepeated: boolean, interval: INTERVAL) {
    this.isRepeated = isRepeated;
    this.interval = interval;
  }

  isEqual(repeatedTask: RepeatedTask): boolean {
    return this.isRepeated === repeatedTask.isRepeated &&
      this.interval === repeatedTask.interval;
  }
}

export class Reminder {
  isReminderOn: boolean;
  remindAt: RemindAT;

  constructor(isReminderOn: boolean, remindAt: RemindAT) {
    this.isReminderOn = isReminderOn;
    this.remindAt = remindAt;
  }

  isEqual(reminder: Reminder): boolean {
    return this.isReminderOn === reminder.isReminderOn &&
      this.remindAt === reminder.remindAt;
  }
}

export enum RemindAT {
  FiveMinBefore = '05 minutes before',
  TenMinBefore = '10 minutes before',
  FifteenMinBefore = '15 minutes before',
  ThirtyMinBefore = '30 minutes before'
}

export enum INTERVAL {
  NONE = 'None',
  HOURLY = 'Hourly',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly'
}

export enum CATEGORY {
  ALL = 'All',
  NOCATEGORY = 'No Category',
  WORK = 'Work',
  PERSONAL = 'Personal',
  WISHLIST = 'Wishlist',
  BIRTHDAY = 'Birthday'
}

