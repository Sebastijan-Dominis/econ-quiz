// imports
import { defineStore } from 'pinia';
import { doc, getDocs, collection, query, where, getDoc } from 'firebase/firestore';
import { db } from "../js/firebase";

export const useStoreQuiz = defineStore('storeQuiz', {
    state: () => {
        return {
            questions: [],
            correctAnswers: 0
        }
    },
    actions: {
        // Fisher-Yates (Knuth) shuffle
        shuffle(array) {
            for (let i = array.length - 1; i > 1; i--) {
                let j = Math.floor(Math.random() * (i + 1)); 
                [array[i], array[j]] = [array[j], array[i]];
            }
        },
        async fetchQuiz(choice, difficulty) {
            const quiz = await getDocs(collection(db, "quizzes", choice, difficulty));
            quiz.forEach(doc => {
                const temp = [];
                temp.push(doc.data().optionA);
                temp.push(doc.data().optionB);
                temp.push(doc.data().optionC);
                temp.push(doc.data().optionD);
                this.shuffle(temp);
                const q = {
                    question: doc.data().question,
                    answer: doc.data().correct,
                    A: temp[0],
                    B: temp[1],
                    C: temp[2],
                    D: temp[3],
                }
                this.questions.push(q);
            })
            this.shuffle(this.questions);
            // O(n), but so is shuffle, and this simplifies the rest of the quiz logic
            this.questions.unshift(null);
        }
    }
})