import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { uid } from 'uid/secure';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { Task } from './entities/task.entity';

const TASKS: Task[] = [
  {
    id: '1',
    title: 'Pembentukan tim logistik',
    description: 'Seluruh tim sudah terbentuk',
    due_date: new Date(2026, 10, 20),
    status: 'COMPLETED',
    create_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2',
    title: 'Survey lokasi',
    description: 'Tim Logistik melakukan survey ke lokasi acara',
    due_date: new Date(2026, 10, 27),
    status: 'IN_PROGRESS',
    create_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '3',
    title: 'Deal lokasi dengan vendor',
    description: 'Pengesahan lokasi acara dengan vendor',
    due_date: new Date(2026, 10, 30),
    status: 'UNASSIGNED',
    create_at: new Date(),
    updated_at: new Date(),
  },
];

@Injectable()
export class TasksService {
  create(data: CreateTaskDto) {
    const exist = TASKS.find((val) => val.title === data.title);
    if (exist) {
      throw new ConflictException();
    }
    const newTask: Task = {
      ...data,
      create_at: new Date(),
      updated_at: new Date(),
      status: 'UNASSIGNED',
      id: uid(),
    };
    TASKS.push(newTask);
    return newTask;
  }

  findAll() {
    return TASKS;
  }

  findOne(id: string) {
    const task = TASKS.find((val) => val.id === id);
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  update(id: string, newTask: UpdateTaskDto) {
    const idx = TASKS.findIndex((val) => val.id === id);
    if (idx === -1) {
      throw new NotFoundException();
    }
    const exist = TASKS[idx];
    const updated: Task = {
      ...exist,
      ...newTask,
      updated_at: new Date(),
    };
    TASKS[idx] = updated;
    return updated;
  }

  remove(id: string) {
    const idx = TASKS.findIndex((val) => val.id === id);
    if (idx === -1) {
      throw new NotFoundException();
    }
    TASKS.splice(idx, 1);
    return;
  }
}
