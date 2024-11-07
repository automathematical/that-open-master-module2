import { ErrorMessage } from '../src/class/ErrorMessage'
import { IProject, UserRole, ProjectStatus, Project } from '../src/class/Project'
import { ProjectManager } from '../src/class/ProjectManager'
import { ITodo, Todo } from './class/Todo'

const projectListUI = document.getElementById('projects-list') as HTMLElement
const projectManager = new ProjectManager(projectListUI)
console.log('initial list', projectManager.list);

function toggleModal(active: boolean, id: string) {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    active ? modal.showModal() : modal.close()
  } else {
    console.warn("the provided modal wasn't found. ID: ", id);
  }
}

// new project
const newProjectBtn = document.getElementById('new-project-btn')
if (newProjectBtn) {
  newProjectBtn.addEventListener('click', () => {
    toggleModal(true, 'new-project-modal')
  })
}

const projectForm = document.getElementById('new-project-form')
if (projectForm && projectForm instanceof HTMLFormElement) {
  projectForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(projectForm)
    const projectData: IProject = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as ProjectStatus,
      userRole: formData.get('userRole') as UserRole,
      finishDate: new Date(formData.get("finishDate") as string),
      id: formData.get("id") as string,
      todoList: []
    }
    try {
      projectManager.createProject(projectData)
      projectForm.reset()
      toggleModal(false, "new-project-modal")
      console.log('updated list', projectManager.list)
    } catch (error) {
      projectForm.reset();
      (new ErrorMessage(projectForm, error)).showError()
    }
  })
} else {
  console.log('The Project form was not found')
}

const cancelBtnNew = document.getElementById('cancel-btn-new')
if (cancelBtnNew) {
  cancelBtnNew.addEventListener('click', () => {
    toggleModal(false, 'new-project-modal')
  })
}

// Edit project
const editProjectBtn = document.getElementById('edit-project-btn')
if (editProjectBtn) {
  editProjectBtn.addEventListener('click', () => {
    toggleModal(true, 'edit-project-modal')
  })
}

const editForm = document.getElementById('edit-project-form')
if (editForm && editForm instanceof HTMLFormElement) {
  editForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(editForm)
    const projectData: IProject = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as ProjectStatus,
      userRole: formData.get('userRole') as UserRole,
      finishDate: new Date(formData.get("finishDate") as string),
      id: formData.get("id") as string,
      todoList: []
    }
    try {
      projectManager.updateProject(new Project(projectData))
      console.log('Project updated');
      editForm.reset()
      toggleModal(false, "edit-project-modal")

      console.log('updated list', projectManager.list)
    } catch (error) {
      editForm.reset();
      (new ErrorMessage(editForm, error)).showError()
    }
  })
}

const cancelBtnEdit = document.getElementById('cancel-btn-edit')
if (cancelBtnEdit) {
  cancelBtnEdit.addEventListener('click', () => {
    toggleModal(false, 'edit-project-modal')
  })
}

// New Todo
const newToDoBtn = document.getElementById('new-todo-btn')
if (newToDoBtn) {
  newToDoBtn.addEventListener('click', () => {
    toggleModal(true, 'new-todo-modal')
  })
}

const todoForm = document.getElementById('new-todo-form')
if (todoForm && todoForm instanceof HTMLFormElement) {
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(todoForm)
    const todoData: ITodo = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as ProjectStatus,
      finishDate: new Date(formData.get("finishDate") as string),
      id: formData.get("id") as string,
    }
    try {
      // projectManager.createTodo(TodoData)
      const projectId = (document.querySelector('[data-project-info="id"]'))?.textContent
      const project = projectManager.list.find((p) => p.id === projectId);
      if (!project) { console.log('Project not found'); return }
      project.todoList.push(new Todo(todoData))
      todoForm.reset()
      projectManager.updateTodoDetails(new Todo(todoData))
      console.log('status', todoData.status);
      projectManager.setStateColor(todoData.status)
      toggleModal(false, "new-todo-modal")
      console.log('updated list', projectManager.list)
    } catch (error) {
      todoForm.reset();
      (new ErrorMessage(todoForm, error)).showError()
    }
  })
} else {
  console.log('The todo form was not found')
}

// update todo
const newUpdateTodoBtn = document.getElementById('new-update-todo-btn')
if (newUpdateTodoBtn) {
  newUpdateTodoBtn.addEventListener('click', () => {
    toggleModal(true, 'new-update-todo-modal')
  })
}

const updateTodo = document.getElementById('new-update-todo-form')
if (updateTodo && updateTodo instanceof HTMLFormElement) {
  updateTodo.addEventListener('submit', (e) => {
    console.log('submit todo clicked')
    e.preventDefault()
    const formData = new FormData(updateTodo)
    const todoData: ITodo = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as ProjectStatus,
      finishDate: new Date(formData.get("finishDate") as string),
      id: formData.get("id") as string,
    }
    try {
      projectManager.updateTodo(new Todo(todoData))
      console.log('status', todoData.status);
      projectManager.setStateColor(todoData.status)
      console.log('Project updated');
      updateTodo.reset()
      toggleModal(false, "new-update-todo-modal")

      console.log('updated list', projectManager.list)
    } catch (error) {
      updateTodo.reset();
      (new ErrorMessage(updateTodo, error)).showError()
    }
  })
}

const cancelBtnUpdateTodo = document.getElementById('cancel-btn-todo-update')
if (cancelBtnUpdateTodo) {
  cancelBtnUpdateTodo.addEventListener('click', () => {
    toggleModal(false, 'new-update-todo-modal')
  })
}

const cancelBtnTodoNew = document.getElementById('cancel-btn-todo-new')
if (cancelBtnTodoNew) {
  cancelBtnTodoNew.addEventListener('click', () => {
    toggleModal(false, 'new-todo-modal')
  })
}

const exportProjectsBtn = document.getElementById("export-projects-btn")
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectManager.exportProject()
  })
}

const importProjectsBtn = document.getElementById("import-projects-btn")
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectManager.importFromJSON()
  })
}
