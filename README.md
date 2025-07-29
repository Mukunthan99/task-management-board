# Task Management Board
A kanban-style task management board built using React, TypeScript, Tailwind CSS, and TanStack libraries. It enables users to organize their work efficiently across different stages (To Do, In Progress, Completed), with persistent data and a smooth drag-and-drop interface — all within a clean and responsive UI.

## Objective
This project simulates a real-world Trello-like productivity tool. It is built with modern frontend technologies to demonstrate:
1. Type-safe form management (TanStack Form)
2. State management using React Query with a simulated API using Promises and Callbacks
3. Component reusability and responsiveness using Tailwind CSS
4. Drag-and-drop task organisation using DnD Kit
5. This is intended as a frontend coding challenge submission, showcasing clean architecture, performance awareness, and a user-friendly experience.

## Features Implemented
### 1. Task Creation
- Users can create new tasks with a title and description.
- The task is automatically added to the "To Do" column.
- Modal opens via a “Create Task” button using ShadCN's modal component.
- Validated using TanStack Form (fields required).

 ### 2. Task Editing
- Click on a task card to reopen the modal.
- Existing task data is pre-filled for quick edits.
- Data is updated locally and revalidated via useMutation().

### 3. Drag & Drop Tasks
- Tasks can be moved across columns (To Do → In Progress → Completed).
- Implemented using @dnd-kit/core, SortableContext, and sensors.
- Drag-and-drop changes are persisted in localStorage.

### 4. Persistent Storage with Simulated API
- All data is saved to localStorage.
- Simulated latency using setTimeout to mimic async behaviour.
- TanStack Query is used to fetch, cache, and update tasks with loading states.

### 5. Search Functionality
- Live filter bar for searching tasks by title.
- Case-insensitive and real-time filtering.

### 6. Responsive UI (Tailwind CSS)
- Mobile, tablet, and desktop-friendly layout.
- Drag-and-drop and modals are fully responsive.
- Visuals adapt to screen size gracefully.

### 7. Conditional UI Feedback
- Tasks with due dates in the past are highlighted (e.g., red background).
- Hover and transition effects for smooth UX.

## Technologies Used
```
| Tech               | Purpose                                |
| ------------------ | -------------------------------------- |
| React + TypeScript | Component architecture, type safety    |
| Tailwind CSS       | Styling and layout                     |
| TanStack Query     | Simulated API with caching & mutations |
| TanStack Form      | Type-safe form validation & state      |
| @dnd-kit/core      | Drag and drop functionality            |
| ShadCN/UI + Radix  | Modals and accessible UI components    |
| localStorage       | Persistent client-side storage         |
| Vite               | Fast dev/build tooling                 |

```
## Stimulated Backend Behavior
- Instead of using an actual backend, all task data is stored in localStorage.
- Simulated delay using setTimeout() gives the impression of network calls.
- This provides a real-world experience of fetching/loading states and cache updates via React Query.

## Task Lifecycle
1. User clicks Create Task
2. Modal form opens, validates inputs with TanStack Form
3. On submit:
    - Task is added to "To Do"
    - LocalStorage is updated
    - React Query cache is updated
4. User drags the task to "In Progress"
    - React Query mutation is called
    - LocalStorage and cache are updated again
  
## Landing Page
<img width="1710" height="981" alt="task-management landing-page" src="https://github.com/user-attachments/assets/bb661051-4ae4-457a-8cdd-fa7a852f79b5" />

