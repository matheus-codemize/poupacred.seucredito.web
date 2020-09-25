import actionsTypes  from '../constants/sidebar'

const actions = {
    open: () => ({
        type: actionsTypes.OPEN,
        payload: { open: true }
    }),
    close: () => ({
        type: actionsTypes.CLOSE,
        payload: { open: false }
    })
}

export default actions