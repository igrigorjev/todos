export default class Form {
    el;
    fields;

    constructor(el, validators, onSubmit) {
        this.el = el
        this.onSubmit = onSubmit

        const fields = []
        Object.entries(validators).forEach(entry => {
            const name = entry[0]
            const input = this.el.querySelector(`input[name="${name}"]`)

            fields.push({
                name,
                input,
                validator: entry[1],
                isValid: false
            })
        })
        this.fields = fields
    }

    init() {
        if (!this.el) {
            return
        }

        this.el.addEventListener('submit', event => {
            event.preventDefault()

            this.submit()
        })

        this.fields.forEach(field => {
            const {input} = field

            input.addEventListener('input', () => {
                this.validateField(field)
            })
        })

        this.el.classList.add('form_init')
    }

    validateField(field) {
        const {input, validator} = field
        const value = input.value

        const validationResult = validator(value, this.fields)

        if (validationResult) {
            this.setInputElementErrorValue(field, validationResult)
        } else {
            this.setInputElementErrorValue(field, '')
        }

        return validationResult
    }

    setInputElementErrorValue(field, validationResult) {
        const errorInput = field.input.nextElementSibling

        if (validationResult) {
            field.input.classList.add('text-field_error')
            errorInput.innerText = validationResult
            field.isValid = false
        } else {
            field.input.classList.remove('text-field_error')
            errorInput.innerText = ''
            field.isValid = true
        }
    }

    submit() {
        let isValid = true

        this.fields.forEach(field => {
            const validationErrorResult = this.validateField(field)

            if (validationErrorResult) {
                isValid = false
            }
        })

        if (isValid) {
            this.onSubmit(this.fields)
            this.fields.forEach(el => el.input.value = "")
        }
    }

    showForm() {
        this.el.classList.remove('hideform')
        this.el.classList.add('showform')
    }

    hideForm() {
        this.el.classList.remove("showform")
        this.el.classList.add('hideform')
    }
}
