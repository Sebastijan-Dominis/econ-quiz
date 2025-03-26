// imports
import { defineStore } from "pinia";

export const useStoreEditQuiz = defineStore('storeEditQuiz', {
    state: () => {
        return {
            editOrDelete: false,
            chosenTopic: null,
            currTopic: {
                name: null,
                displayName: null,
                shortName: null,
                key: null,
                year: null,
                indicator: null,
                display: null,
                cannotOver100: null,
                cannotBelow0: null
            }
        }
    },
    actions: {

    }
})