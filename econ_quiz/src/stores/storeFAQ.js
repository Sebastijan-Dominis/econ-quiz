import { defineStore } from "pinia";
import { db } from "../js/firebase";
import { getDocs, query, collection } from "firebase/firestore";

export const useStoreFAQ = defineStore('storeFAQ', {
    state: () => {
        return {
            faqs: []
        }
    },
    actions: {
        async fetchFAQ() {
            const faqRef = collection(db, 'faq');
            const q = query(faqRef);
            const snapshot = await getDocs(q);
            if(!snapshot.empty) {
                const faqs = snapshot.docs;
                for(const faq of faqs) {
                    const data = faq.data();
                    const q = data.Q;
                    const a = data.A;
                    const curr = {q, a};
                    this.faqs.push(curr);
                }
            }
        }
    }
})