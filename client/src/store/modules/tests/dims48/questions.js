
export default {
    namespaced: true,
    state: {
        images: null,
        options: null,
        currentImageIndex: 45,
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
            const options = state.options.filter(e => e._id === rootState.dimsManager.currentPhase)[0].options;
            console.log(options);
            return options;
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
        },
        updateOptions: (state, options) => {
            state.options = options;
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
    }
}