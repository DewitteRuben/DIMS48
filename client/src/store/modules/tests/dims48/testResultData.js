export default {
    namespaced: true,
    state: {
        answers: {
            phase1: [],
            phase2: []
        }
    },
    getters: {

    },
    mutations: {
        setAnswer(state, payload) {
            state.answers[payload.phase].push(payload.answer);
        }
    },
    actions: {
    }
}