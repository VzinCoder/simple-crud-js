const form = document.querySelector('form')
const span = document.getElementById('alert')
const button = document.querySelector('.button-outline')
const containerTable = document.querySelector('.container-table')
const divListPeople = document.querySelector('.list-people')

const patternName = /^[a-zA-z]{3,11}$/
const patternAge = /^[0-9]{0,3}$/
const patternCpf = /^[0-9]{11}$/


let people = []
let idSetTimeOut = null
let isAddPerson = true

const changeColorByCheck = (pattern, input) => {
    const result = pattern.test(input.value)

    if (!result && input.value.length > 0) {
        input.style.backgroundColor = '#fa6a64'
        return
    }
    input.style.backgroundColor = 'white'
}

const handleKeyup = event => {
    const inputClicked = event.target
    const tagName = inputClicked.name

    switch (tagName) {
        case 'name':
            changeColorByCheck(patternName, inputClicked)
            return
        case 'age':
            changeColorByCheck(patternAge, inputClicked)
            return
        case 'cpf':
            changeColorByCheck(patternCpf, inputClicked)
    }


}

const resetSpan = () => {
    span.innerText = ''
    span.removeAttribute('class')
}

const changeSpan = (op, txt) => {

    span.textContent = txt

    switch (op) {
        case 'sucess':
            span.setAttribute('class', 'sucess')
            return
        case 'warning':
            span.setAttribute('class', 'warning')
            return
    }

    span.toggleAttribute('class')

}


const clearInput = () => {
    const inputs = form.querySelectorAll('input')
    inputs.forEach(input => input.value = '')
}

const checkCpfUsed = (cpf) => people.some(person => person.cpf === cpf)

const resetTimeout = () => {
    if (idSetTimeOut) {
        clearTimeout(idSetTimeOut)
        idSetTimeOut = null
    }
}

const changeSpanAndThrowTimeout = (className, txt) => {
    changeSpan(className, txt)
    idSetTimeOut = setTimeout(resetSpan, 3000)
}

const addPerson = (person) => {
    const { name } = person
    const nameUpperCase = name.toUpperCase()
    people.push(person)
    changeSpanAndThrowTimeout('sucess', `Person ${nameUpperCase} registered`)
    clearInput()
}

const changeIsAddPerson = () => isAddPerson = !isAddPerson

const changeTextBtnForm = (txt) => {
    const btn = form.querySelector('button')
    btn.textContent = txt
}

const toggleDisableInputs = () => {
    const inputCpf = form.cpf

    inputCpf.toggleAttribute('disabled')
    button.toggleAttribute('disabled')

    if (!isAddPerson) {
        inputCpf.style.backgroundColor = 'grey'
        return
    }

    inputCpf.style.backgroundColor = 'white'
}

const alterFunction = (classCss, txt, txtbtn) => {
    changeIsAddPerson()
    toggleDisableInputs()
    changeTextBtnForm(txtbtn)
    changeSpan(classCss, txt)
}

const alterPerson = ({ name, age, cpf }) => {
    const person = people.find(person => person.cpf === cpf)
    person.name = name
    person.age = age
    alterFunction('sucess', `Person ${name} successfully changed`, 'add person')
    idSetTimeOut = setTimeout(resetSpan, 3000)
    clearInput()
}

const handleSubmit = (event) => {
    event.preventDefault()

    const name = form.name.value
    const age = form.age.value
    const cpf = form.cpf.value

    const isName = patternName.test(name)
    const isCpf = patternCpf.test(cpf)
    const isAge = patternAge.test(age)

    const isPerson = isName && isCpf && isAge
    const iscpfUsed = checkCpfUsed(cpf)
    const person = { name, age, cpf }

    resetTimeout()

    if (isAddPerson && isPerson && !iscpfUsed) {
        addPerson(person)
        return
    } else if (!isAddPerson && isPerson && iscpfUsed) {
        alterPerson(person)
        return
    }

    changeSpanAndThrowTimeout('warning', `Invalid Data!`)


}

const assemblyLines = () => {
    let s = ''
    people.forEach(({ name, age, cpf }) => {
        s += `<tr>
        <td>${name}</td>
        <td>${age}</td>
        <td>${cpf}</td>
        <td>
            <span class='btn-row warning'>Delete</span>
            <span class='btn-row sucess'>Alter</span>
        </td>
      </tr>`
    })
    return s
}

const createTable = () => {
    const lines = assemblyLines()
    containerTable.innerHTML = `<table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Cpf</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
         ${lines}
        </tbody>
      </table>`
}

const insertSpan = () => {
    const isSpan = containerTable.querySelector('span')
    if (!isSpan) {
        const span = document.createElement('span')
        span.textContent = 'No Person Registered'
        span.classList.add('no-person')
        containerTable.append(span)
    }

}

const handleButtonViewPeople = () => {
    divListPeople.style.display = 'flex'
    if (people.length > 0) {
        createTable()
        return
    }
    insertSpan()

}

const desativeList = () => {
    divListPeople.style.display = 'none'
}

const desativeListCheck = (event) => {
    const className = event.target.classList[0]
    if (className === 'list-people') {
        desativeList()

    }
}


const getCpfTd = (element) => {
    const parentElement = element.parentNode
    const previousSibling = parentElement.previousElementSibling
    const cpf = previousSibling.textContent
    return cpf
}

const deletePerson = element => {

    const cpf = getCpfTd(element)
    people = people.filter(person => person.cpf !== cpf)
    const isGreatThanZero = people.length > 0

    if (isGreatThanZero) {
        createTable()
        return
    }

    containerTable.innerHTML = ''
    insertSpan()
}


const changeInputWithPerson = ({ name, age, cpf }) => {
    form.name.value = name
    form.age.value = age
    form.cpf.value = cpf
}


const getPersonToForm = element => {
    const cpf = getCpfTd(element)
    const person = people.find(person => person.cpf === cpf)

    if (person) {
        desativeList()
        changeInputWithPerson(person)
        alterFunction(null, `Alter person ${person.name}`, 'Alter person')
        resetTimeout()
    }

}


const handleClickContainerTable = (event) => {
    const elementClicked = event.target
    const classNameElement = elementClicked.classList[1]

    switch (classNameElement) {
        case 'warning':
            deletePerson(elementClicked)
            return
        case 'sucess':
            getPersonToForm(elementClicked)
            return
    }

}

form.addEventListener('keyup', handleKeyup)
form.addEventListener('submit', handleSubmit)
button.addEventListener('click', handleButtonViewPeople)
divListPeople.addEventListener('click', desativeListCheck)
containerTable.addEventListener('click', handleClickContainerTable)