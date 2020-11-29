export default {

  getTodos() {
    return JSON.parse(localStorage.getItem('todos'));
  },

  saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
  },
};
