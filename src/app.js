const form = document.querySelector('form')
const span = document.getElementById('alert')
const button = document.querySelector('.button-outline')
const containerTable = document.querySelector('.container-table')
const divListPeople = document.querySelector('.list-people')

const patternName = /^[a-zA-z]{3,11}$/
const patternAge = /^[0-9]{0,3}$/
const patternCpf = /^[0-9]{11}$/

let people = []

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

const changeSpan = (boolean, txt) => {
    if (boolean) {
        span.textContent = txt
        span.setAttribute('class', 'sucess')
        return
    }

    span.textContent = txt
    span.setAttribute('class', 'warning')
}

const addPerson = (event) => {
    event.preventDefault()

    const name = form.name.value
    const age = form.age.value
    const cpf = form.cpf.value

    const isName = patternName.test(name)
    const isCpf = patternCpf.test(cpf)
    const isAge = patternAge.test(age)

    const isPerson = isName && isCpf && isAge
    const cpfUsed = people.some(person => person.cpf === cpf)
    const isChecked = isPerson && !cpfUsed

    if (isChecked) {
        const person = { name, age, cpf }
        const nameUpperCase = name.toUpperCase()

        people.push(person)
        changeSpan(isChecked, `Person ${nameUpperCase} registered`)
        setTimeout(resetSpan, 3000)

        return
    }

    changeSpan(isChecked, `Invalid Data!`)
    setTimeout(resetSpan, 3000)


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

const createTable = () =>{
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

const insertSpan = () =>{
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

const desativeList = (event) => {
    const className = event.target.classList[0]
    if (className === 'list-people') {
        divListPeople.style.display = 'none'

    }
}


const deletePerson = (element) =>{

    const parentElement = element.parentNode
    const previousSibling = parentElement.previousElementSibling
    people = people.filter(person => person.cpf !== previousSibling.textContent)
    const isGreatThanZero = people.length > 0

    if(isGreatThanZero){
        createTable()
        return
    }

    containerTable.innerHTML = ''
    insertSpan()
}

const handleClickContainerTable = (event) => {
    const elementClicked = event.target
    const classNameElement = elementClicked.classList[1]

    switch (classNameElement) {
        case 'warning':
            deletePerson(elementClicked)
            return
        case 'sucess':
            return
    }

}

form.addEventListener('keyup', handleKeyup)
form.addEventListener('submit', addPerson)
button.addEventListener('click', handleButtonViewPeople)
divListPeople.addEventListener('click', desativeList)
containerTable.addEventListener('click',handleClickContainerTable)