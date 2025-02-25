// imports
import { defineStore } from 'pinia';
import { doc, getDocs, collection, query, where, getDoc } from 'firebase/firestore';
import { db } from "../js/firebase";

export const useStoreQuiz = defineStore('storeQuiz', {
    state: () => {
        return {
            questions: []
        }
    },
    actions: {
        async fetchQuiz(choice, difficulty) {
            const quiz = await getDocs(collection(db, "quizzes", choice, difficulty));
            quiz.forEach(doc => {
                const q = {
                    question: doc.data().question,
                    A: doc.data().optionA,
                    B: doc.data().optionB,
                    C: doc.data().optionC,
                    D: doc.data().optionD,
                    answer: doc.data().correct
                }
                this.questions.push(q);
            })
            console.log(this.questions);
        }
    }
})