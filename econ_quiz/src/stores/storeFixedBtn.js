import { defineStore } from "pinia";

export const useStoreFixedBtn = defineStore('storeFixedBtn', {
    state: () => {
        return {
            isFixed: false,
            isFixedStudy: false
        }
    },
    actions: {
        
    }
})