import styles from './todoList.styles.scss';
import todoService from '../../services/todoService';

const style = document.createElement('style');
const template = document.createElement('template');

template.innerHTML = `
    <h1>Todo List</h1>
`;

export default class TodoList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: 'open',
    });
    style.textContent = styles;
    this.todos = [];
    this.shadowRoot.appendChild(style.cloneNode(true));
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    if (!todoService.getTodos()) {
      todoService.saveTodos([]);
    }
    this.todos = todoService.getTodos();
    this.append();
    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener('addTodoEvent', (e) => {
      this.todos.push(e.detail);
      this.render();
    });
    document.addEventListener('deleteTodoEvent', (e) => {
      this.todos.splice(e.detail, 1);
      this.render();
    });
    document.addEventListener('editTodoEvent', ({ detail: { id, content } }) => {
      this.todos[id] = content;
      todoService.saveTodos(this.todos);
    });
  }

  append() {
    this.todos.forEach((content, index) => {
      const todoItem = document.createElement('todo-item');
      todoItem.setAttribute('content', content);
      todoItem.setAttribute('id', `todoItem${index + 1}`);
      todoItem.classList.add('item');
      this.shadowRoot.appendChild(todoItem);
    });
  }

  render() {
    this.shadowRoot.querySelectorAll('todo-item').forEach((item) => {
      this.shadowRoot.removeChild(item);
    });
    this.append();
    todoService.saveTodos(this.todos);
  }
}

window.customElements.define('todo-list', TodoList);
