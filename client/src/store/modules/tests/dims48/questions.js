export default {
    namespaced: true,
    state: {
        images: null,
        filteredImages: [],
        currentImageIndex: 0,
        options: {
            phase1: [
                {
                    btnText: '2 or less',
                    btnValue: '<=2'
                },
                {
                    btnText: '3 or more',
                    btnValue: '>=3'
                }
            ],
            phase2: [
                {
                    btnText: 'Left',
                    btnValue: 'L'
                },
                {
                    btnText: 'Right',
                    btnValue: 'R'
                },
            ],
        }
    },
    getters: {
        getCurrentImage: (state, getters, rootState) => {
            const double = rootState.dimsManager.double;
            const singleImages = state.images.filter(e => e._id.includes("A"));

            const imageNumber = state.currentImageIndex + 1;
            const doubleImages = state.images.filter((e) => (e._id === "A" + imageNumber || e._id === "B" + imageNumber));
            
            return double ? doubleImages : singleImages;
        },
        getCurrentOptions: (state, getters, rootState) => {
            return state.options[rootState.dimsManager.currentPhase];
        },
        isLoaded: state => {
            return state.images !== null;
        }
    },
    mutations: {
        resetState: state => {
            state.currentImageIndex = 0;
        },
        updateImages: (state, images) => {
            state.images = images;
        }
    },
    actions: {
        getNextImage: ({ commit, state, rootState }, newValue) => {
            const double = rootState.dimsManager.double;
            const images = state.images.filter(e => e._id.includes("A"));

            if (state.currentImageIndex + 1 < images.length && images.length > 0) {
                state.currentImageIndex++;
            } else {
                commit('resetState');
                commit('dimsManager/endPhase', null, { root: true });
            }

        },
        fetchImages: ({ commit }) => {
            fetch("https://how-to-test-apps.herokuapp.com/api/dims48Begin")
                .then(e => e.json())
                .then(e => {
                    console.log(e);
                    commit("updateImages", e.images)
                })
                .catch(e => console.error(e));
        },
    }
}