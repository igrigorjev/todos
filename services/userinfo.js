export default class Userinfo {
    constructor(el,logoutfnc) {
        this.el = el;
        this.logoutfnc = logoutfnc;
        this.email = this.el.querySelector('[data-user-email]')
        this.name = this.el.querySelector('[data-user-name]')
        this.age = this.el.querySelector('[data-user-age]')
        this.logout = this.el.querySelector('[data-user-logout]')
        this.initListeners()
    }

    initListeners() {
        this.logout.addEventListener('click', () => this.logoutfnc())
    }

    setUserInfo(user, clear) {
        const email = this.el.querySelector('[data-user-email]')
        const name = this.el.querySelector('[data-user-name]')
        const age = this.el.querySelector('[data-user-age]')
        const logout = this.el.querySelector('[data-user-logout]')

        email.innerText = clear ? '' : user.email
        name.innerText = clear ? '' : user.name
        age.innerText = clear ? '' : user.age
        logout.innerText = clear ? '' : 'Выйти'
    }

}
