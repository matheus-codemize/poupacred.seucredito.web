import actionsTypes  from '../constants/auth'

const actions = {
    signIn: (data) => ({
        type: actionsTypes.SIGNIN,
        payload: data
    }),
    logout: () => ({
        type: actionsTypes.LOGOUT
    }),
    first: (data) => ({
        type: actionsTypes.FIRST,
        payload: data
    })
}

export default actions