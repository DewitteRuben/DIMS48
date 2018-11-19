import * as howToTestApi from "@/services/api/howtotestapi";

export default {
    namespaced: true,
    state: {
        version: "dims48a",
        currentPhase: "phase1",
        double: false,
        interference: false,
        started: false,
        loaded: false,
        finished: false,
    },
    getters: {
        hasStarted: state => {
            return state.started;
        },
    },
    mutations: {
        startPhase: state => {
            if (state.version === "dims48b")
                state.double = true;

            switch (state.currentPhase) {
                case "end":
                    state.finished = true;
                    break;
                case "interference":
                    state.interference = true;
                    break;
                default:
                    state.started = true;
                    break;
            }
        },
        endPhase: state => {
            switch (state.currentPhase) {
                case "phase1":
                    if (state.version === "dims48a") {
                        state.currentPhase = "interference";
                    } if (state.version === "dims48b") {
                        state.currentPhase = "end";
                    }
                    break;
                case "interference":
                    state.currentPhase = "phase2";
                    state.interference = false;
                    state.double = true;
                    break;
                case "phase2":
                    state.currentPhase = "end";
                    break;
            }
            state.started = false;
        },
        setLoaded: state => {
            state.loaded = true;
        },
        resetState: state => {
            state.version = "dims48a";
            state.currentPhase = "phase1";
            state.double = false;
            state.interference = false;
            state.started = false;
            state.loaded = false;
            state.finished = false;
        },
    },
    actions: {
        initializeTest: ({ commit }) => {
            howToTestApi.getDims48().then(res => {
                commit('dimsQuestions/updateImages', res.images, { root: true });
                commit('dimsInstructions/updateInstructions', res.instructions, { root: true });
                commit('dimsQuestions/updateOptions', res.options, { root: true });
            }).catch(err => {
                console.error(err);
            });
        },
        resetState: ({ commit }) => {
            commit('resetState');
            commit('dimsQuestions/resetState', null, { root: true });
            commit('dimsInstructions/resetState', null, { root: true });
        }
    },
}