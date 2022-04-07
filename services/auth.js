export class Auth {
    constructor(authOk,authfalse) {
        if (typeof Auth.instance === 'object') {
            return Auth.instance
        }
        this.init()
        Auth.instance = this
        return Auth.instance
    }

    init() {
        this.userInfoEl = document.querySelector('[data-user-info]')
        this.initlogoutListeners()
    }

    initlogoutListeners() {
        this.userInfoEl.querySelector('[data-user-logout]').addEventListener('click', () => this.logout())
    }

    async auth(body) {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const result = await fetch("http://localhost:5000/api/login", {
            method: 'POST',
            body: JSON.stringify(body),
            headers,
        })
        const data = await result.json()

        if (data.ok) {
            const token = data.data.accessToken
            this.setToken(token)
        }

        return data
    }

    async reg(body) {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const result = await fetch("http://localhost:5000/api/registration", {
            method: 'POST',
            body: JSON.stringify(body),
            headers,
        })
        const data = await result.json()

        if (data.ok) {
            const token = data.data.accessToken
            this.setToken(token)
            return data
        }
    }

    async me() {
        if (!this.getToken()) {
            return false
        }

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append('Authorization', `Bearer ${this.getToken()}`)
        console.log(headers.get('Authorization'))
        let result = await fetch("http://localhost:5000/api/me", {
            method: 'GET',
            headers,
        })

        const data = await result.json()

        if(data && data.ok) {
            this.setUserInfo(data.data.user)
            this.setAuth()
        } else {
            console.log("авторизация не удалась")
        }

    }

    async logout() {
        this.removeToken()
        this.setUserInfo('', true)
        this.removeAuth()
    }

    setUserInfo(user, clear) {
        const email = this.userInfoEl.querySelector('[data-user-email]')
        const name = this.userInfoEl.querySelector('[data-user-name]')
        const age = this.userInfoEl.querySelector('[data-user-age]')
        const logout = this.userInfoEl.querySelector('[data-user-logout]')

        email.innerText = clear ? '' : user.email
        name.innerText = clear ? '' : user.name
        age.innerText = clear ? '' : user.age
        logout.innerText = clear ? '' : 'Выйти'
    }

    setToken(token) {
        localStorage.setItem('access-token', token)
    }

    removeToken() {
        localStorage.removeItem('access-token')
    }

    getToken() {
        return localStorage.getItem('access-token')
    }

    setAuth() {
        document.body.classList.add('auth-success')
    }

    removeAuth() {
        document.body.classList.remove('auth-success')
    }

}
