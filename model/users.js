const uuidv1 = require('uuid/v1')
const tcomb = require('tcomb')
const crypt = require('../model/crypt')


const USER = tcomb.struct({
    id: tcomb.String,
    name: tcomb.String,
    login: tcomb.String,
    age: tcomb.Number,
    password: tcomb.String
}, {strict: true})

const users = [
    {
        id: '45745c60-7b1a-11e8-9c9c-2d42b21b1a3e',
        name: 'Pedro Ramirez',
        login: 'pedro',
        age: 44,
        password: 'test-mdp'
    }, {
        id: '456897d-98a8-78d8-4565-2d42b21b1a3e',
        name: 'Jesse Jones',
        login: 'jesse',
        age: 48,
        password: 'test-mdp'
    }, {
        id: '987sd88a-45q6-78d8-4565-2d42b21b1a3e',
        name: 'Rose Doolan',
        login: 'rose',
        age: 36,
        password: 'test-mdp'
    }, {
        id: '654de540-877a-65e5-4565-2d42b21b1a3e',
        name: 'Sid Ketchum',
        login: 'sid',
        age: 56,
        password: 'test-mdp'
    }
]

const get = (id) => {
    const usersFound = users.filter((user) => user.id === id)
    return usersFound.length >= 1
        ? usersFound[0]
        : undefined
}

const getAll = () => {
    return users
}

//Propagation de l'async TODO
const add = (user) => {
    
    let tmp_pass = user.password
    user.password = crypt.hash(tmp_pass).then((param) => {user.password = param
        const newUser = {
            ...user,
            id: uuidv1(),
        }
        if (validateUser(newUser)) {
            users.push(newUser)
        } else {
            throw new Error('user.not.valid')
        }
        return newUser
    }).catch(function(error) {
        throw error
    })
    
}

//Propagation de l'async TODO
const update = (id, newUserProperties) => {
    

    // On test si le user essaye de modifier le password, on le hash
    if(newUserProperties.hasOwnProperty('password')) {
        let tmp_pass = newUserProperties.password
        newUserProperties.password = crypt.hash(tmp_pass).then((param) => {
            newUserProperties.password = param
            update_steps(id, newUserProperties)
        }).catch(function(error) {
            throw error
        })
    } else {
        update_steps(id, newUserProperties)
    }

}

//On sort la partie traitement du patch de l'update, pour pouvoir aussi bien l'utiliser de façon synchrone qu'asynchrone si jamais on modifie le password
const update_steps = (id, newUserProperties) => {
    const usersFound = users.filter((user) => user.id === id)
    if (usersFound.length === 1) {
        const oldUser = usersFound[0]

        const newUser = {
            ...oldUser,
            ...newUserProperties
        }

        // Control data to patch
        if (validateUser(newUser)) {
            // Object.assign permet d'éviter la suppression de l'ancien élément puis l'ajout
            // du nouveau Il assigne à l'ancien objet toutes les propriétés du nouveau
            Object.assign(oldUser, newUser)
            return oldUser
        } else {
            throw new Error('user.not.valid')
        }
    } else {
        throw new Error('user.not.found')
    }
}

const remove = (id) => {
    const indexFound = users.findIndex((user) => user.id === id)
    if (indexFound > -1) {
        users.splice(indexFound, 1)
    } else {
        throw new Error('user.not.found')
    }
}

function validateUser(user) {
    let result = false
    /* istanbul ignore else */
    if (user) {
        try {
            const tcombUser = USER(user)
            result = true
        } catch (exc) {
            result = false
        }
    }
    return result
}

exports.get = get
exports.getAll = getAll
exports.add = add
exports.update = update
exports.remove = remove