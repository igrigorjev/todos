import Form from "./components/form.js";
import {Auth} from "./services/auth.js";

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
} else {
    init()
}

async function init() {
    new Form(document.getElementById('auth'), {
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
        },
        async (fields) => {
            const obj = {}
            fields
                .forEach(field => {
                    obj[field.name] = field.input.value
                })

            const data = await auth.auth(obj)
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
    await auth.me()

}
