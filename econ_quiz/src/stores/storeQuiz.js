// imports
import { defineStore } from 'pinia';
// import { doc, getDocs, collection, query, where, getDoc } from 'firebase/firestore';
// import { db } from "../js/firebase";
import { useStoreGenerator } from './storeGenerator';
import { useStoreStudy } from './storeStudy';

export const useStoreQuiz = defineStore('storeQuiz', {
    state: () => {
        return {
            questions: [],
            correctAnswers: 0,
            loading: false,
            error: null
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
        // this was an old idea

        // async fetchQuiz(choice, difficulty) {
        //     const quiz = await getDocs(collection(db, "quizzes", choice, difficulty));
        //     quiz.forEach(doc => {
        //         const temp = [];
        //         temp.push(doc.data().optionA);
        //         temp.push(doc.data().optionB);
        //         temp.push(doc.data().optionC);
        //         temp.push(doc.data().optionD);
        //         this.shuffle(temp);
        //         const q = {
        //             question: doc.data().question,
        //             answer: doc.data().correct,
        //             A: temp[0],
        //             B: temp[1],
        //             C: temp[2],
        //             D: temp[3],
        //         }
        //         this.questions.push(q);
        //     })
        //     this.shuffle(this.questions);
        //     // O(n), but so is shuffle, and this simplifies the rest of the quiz logic
        //     this.questions.unshift(null);
        // }

        async fetchQuiz(choice, difficulty) {
            this.loading = true;
            try {
                console.log("started")
                const storeStudy = useStoreStudy();
                await storeStudy.fetchData(choice);
                const numbers = storeStudy.countryData;
                console.log("fetched the numbers")
                console.log(numbers)
                this.shuffle(numbers);
                console.log("shuffled the numbers")
                const storeGenerator = useStoreGenerator();
                const newQuiz = await storeGenerator.generate(choice, difficulty, numbers);
                console.log("generated quiz")
                this.shuffle(newQuiz);
                console.log("shuffled quiz")
                newQuiz.forEach(question => {
                    this.shuffle(question.options);
                });
                console.log("shuffled questions")
                this.questions = newQuiz;
                this.questions.unshift(null);
                console.log("done");
                return true;
            } catch(error) {
                console.log(error)
                this.error = error;
            } finally {
                this.loading = false;
            }
        }
    }
})