import {Auth} from '/services/auth.js'
import Todo from "./services/todo.js";
import Form from "./components/form.js";

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
} else {
    try {
        init()
    } catch (e) {
        console.log(e)
    }
}

async function init() {
    new Form(document.getElementById('formtodo'), {
            'description': (value) => {
                if (!value) {
                    return 'Поле обязательно'
                }
                return false
            },
        },
        async (fields) => {
            const obj = {}

            fields
                .forEach(field => {
                    obj[field.name] = field.input.value
                })
            await todos.addTodo(obj)
        }
    ).init()

    const auth = new Auth()
    await auth.me();

    const todos = new Todo(document.querySelector('[data-todos]'), auth.getToken())

}
