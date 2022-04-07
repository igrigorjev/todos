export default class Todo {
    constructor(el,token) {
        this.el = el
        this.token = token
        this.todos = []
        this.init()
    }

    async init() {
        await this.getTodos()
        await this.renderTodos()
        await this.initListeners()
    }

    async initListeners() {
        this.el.querySelectorAll('[data-todo]').forEach(item =>
            item.addEventListener('click', event => {

                if(event.target.hasAttribute('data-todos-delete')) {
                this.deleteTodo(+event.target.parentElement.dataset.id)}

                if(event.target.hasAttribute('data-todo-checkbox')) {
                    event.preventDefault()
                    this.updateTodo(+event.target.parentElement.dataset.id, {completed: event.target.checked}, async (completed) => {
                        event.target.checked = completed
                    })
            }
            })
        )
    }

    async getTodos() {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append('Authorization', `Bearer ${this.token}`)

        const result = await fetch("http://localhost:5000/api/todo", {
            method: 'GET',
            headers,
        })

        const data = await result.json()
        if(data.ok) {
            const filterdata = []
            data.data.forEach(item => {
                filterdata.push({id: item.id, description: item.description, completed: item.completed})
            })
            this.todos = filterdata
        }
    }

    async addTodo(todo) {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append('Authorization', `Bearer ${this.token}`)

        const result = await fetch("http://localhost:5000/api/todo", {
            method: 'POST',
            body: JSON.stringify(todo),
            headers,
        })

        const addtodo = await result.json()

        if(addtodo.ok) {
            this.todos.push({id: addtodo.data.id, description: addtodo.data.description, completed: addtodo.data.completed})
            this.renderTodos()
            this.initListeners()
        }

    }

    async deleteTodo(id) {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append('Authorization', `Bearer ${this.token}`)

        const result = await fetch(`http://localhost:5000/api/todo/${id}`, {
            method: 'DELETE',
            headers,
        })

        const deleteTodo = await result.json()
        if(deleteTodo.ok) {
            const filteredtodo = this.todos.filter(item => item.id !== id)
            this.todos = filteredtodo
            this.renderTodos()
            this.initListeners()
        }

    }

    async updateTodo(id,completed,onUpdate) {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append('Authorization', `Bearer ${this.token}`)
        const result = await fetch(`http://localhost:5000/api/todo/${id}`, {
            method: 'PUT',
            body: JSON.stringify(completed),
            headers,
        })

        const updateTodo = await result.json()
        if(updateTodo.ok) {
            this.todos.find(item => item.id === id).completed = completed.completed
            await onUpdate(completed.completed)
        }

    }

    renderTodos() {
        let todoHtml = ''

        this.todos.forEach(item =>
            todoHtml += `<div class="todo" data-todo data-id='${ item.id }'>
                <input class="todo-checkbox" data-todo-checkbox type="checkbox" ${ item.completed ? 'checked' : ''} ><span class="todo-text">${ item.description }</span><button data-todos-delete>удалить</button>
            </div>`
        )

        this.el.innerHTML = todoHtml
    }
}
