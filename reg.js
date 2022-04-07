import Form from "./components/form.js";
import {Auth} from '/services/auth.js'

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
} else {
    init()
}

async function init() {
    new Form(
        document.getElementById('reg'),
        {
            'email': (value) => {
                if (!value) {
                    return 'Поле обязательно'
                } else if (!value.toLowerCase().match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )) {
                    return 'Некорректный email'
                }

                return false
            },
            'name': (value) => {
                if (!value) {
                    return 'Поле обязательно'
                } else if (value.length < 3) {
                    return 'Минимум 3 символа'
                } else if (value.length > 32) {
                    return 'Максимум 20 символов'
                }

                return false
            },
            'age': (value) => {
                const age = +value

                if (Number.isNaN(age)) {
                    return 'Неккоректный формат возраста'
                } else if (age < 2) {
                    return 'Слишком маленький возраст'
                }

                return false
            },
            'password': (value) => {
                if (!value) {
                    return 'Поле обязательно'
                } else if (value.length < 6) {
                    return 'Минимум 6 символа'
                } else if (value.length > 32) {
                    return 'Максимум 32 символов'
                }

                return false
            },
            'password-repeat': (value, fields) => {
                const password = fields.find(field => field.name === 'password').input

                if (!value) {
                    return 'Поле обязательно'
                } else if (value !== password.value) {
                    return 'Пароли не совпадают'
                }

                return false
            },
        },
        async (fields) => {
            const obj = {}

            fields
            .filter(field => field.name !== 'password-repeat')
            .forEach(field => {
                obj[field.name] = field.input.value
            })
            const data = await new Auth().reg(obj)

            if(data.ok) {
                auth.setUserInfo(data.data.user)
                auth.setAuth()
            } else {
                auth.setUserInfo({}, true)
                auth.removeAuth()
            }

        }
    ).init()

    const auth = new Auth()
    await auth.me();

}
