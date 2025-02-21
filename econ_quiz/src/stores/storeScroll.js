import { defineStore } from "pinia";

export const useScrollStore = defineStore('storeScroll', {
    state: () => {
        return {
            isFixed: false
        }
    },
    actions: {
        handleScroll() {
            this.isFixed = window.scrollY >= 70;
        }
    }
})