// imports
import { defineStore } from 'pinia';
import { useStoreStudy } from './storeStudy';

export const useStoreQuiz = defineStore('storeQuiz', {
    state: () => {
        return {
            questions: [],
            correctAnswers: 0,
            loading: false,
            error: null,
            // noob: 100x - 500x
            // veryEasy: 20x - 100x
            // easy: 5x - 20x
            // normal: 2x - 5x
            // hard: 30% - 100%
            // veryHard: 5% - 30%
            // absoluteMadman: 0.01% - 5%
            multipliers: {
                "noob": [{
                    "min": 0.002,
                    "max": 0.010
                }, {
                    "min": 100.000,
                    "max": 500.000
                }],
                "veryEasy": [{
                    "min": 0.010,
                    "max": 0.050
                }, {
                    "min": 20.000,
                    "max": 100.000
                }],
                "easy": [{
                    "min": 0.050,
                    "max": 0.200
                }, {
                    "min": 5.000,
                    "max": 20.000
                }],
                "normal": [{
                    "min": 0.200,
                    "max": 0.500
                }, {
                    "min": 2.000,
                    "max": 5.000
                }],
                "hard": [{
                    "min": 0.500,
                    "max": 0.760
                }, {
                    "min": 1.300,
                    "max": 2.000
                }],
                "veryHard": [{
                    "min": 0.760,
                    "max": 0.960
                }, {
                    "min": 1.050,
                    "max": 1.300
                }],
                "absoluteMadman": [{
                    "min": 0.960,
                    "max": 0.999
                }, {
                    "min": 1.001,
                    "max": 1.050
                }]
            }
        }
    },
    actions: {
        // Fisher-Yates (Knuth) shuffle
        shuffle(array) {
            for (let i = array.length - 1; i > 1; i--) {
                let j = Math.floor(Math.random() * (i + 1)); 
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },
        random(min, max, decimals) {
            const rand = Math.random() * (max - min) + min;
            const factor = Math.pow(10, decimals);
            return Math.round(rand * factor) / factor;
        },
        addOrSubtract(number, choice) {
            let rand = Math.random();
            let change;
            const storeStudy = useStoreStudy();
            if(storeStudy.largeNumsDollars.has(choice) || storeStudy.largeNums.has(choice)) change = 1;
            else change = 0.01;
            if (rand >= 0.5) return (Number(number) + change).toFixed(2);
            return (Number(number) - change).toFixed(2);
        },
        async createQuiz(choice, difficulty) {
            this.loading = true;
            try {
                const storeStudy = useStoreStudy();
                await storeStudy.fetchData(choice);
                storeStudy.shuffleCountryData();
                const numbers = [...storeStudy.countryData.value];
                const chosenCountries = new Set();
                while(chosenCountries.size <= 20) {
                    const curr = this.random(0, numbers.length-1, 0);
                    chosenCountries.add(numbers[curr]);
                }
                for(const country of chosenCountries) {
                    const current = {};
                    const question = `What is the ${choice} value for ${country[0]}?`;
                    const correct = Number(`${country[1]}`).toFixed(2);
                    const options = [correct];
                    const same = new Set();
                    same.add(correct);
                    for(let i = 0; i < 3; ) {
                        const upOrDown = this.random(0, 1, 0);
                        const minFactor = this.multipliers[difficulty][upOrDown].min;
                        const maxFactor = this.multipliers[difficulty][upOrDown].max;
                        const min = minFactor * correct;
                        const max = maxFactor * correct;
                        let answer = this.random(min, max, 4);
                        answer = Number(answer).toFixed(2);
                        if(storeStudy.cannotOver100.has(choice) && answer >= 100) {
                            answer = '100.00';
                            console.log(answer, same, same.has(answer));
                            while(same.has(answer)) {
                                const diminish = this.random(0.01, 9, 2);
                                answer = Number(answer - diminish).toFixed(2);
                            }
                        } else {
                            while(same.has(answer)) {
                                answer = this.addOrSubtract(answer, choice);
                            }
                        }
                        same.add(answer);
                        options.push(answer);
                        i++;
                    }
                    this.shuffle(options);
                    current.question = question;
                    current.options = options;
                    current.correct = correct;
                    this.questions.push(current);
                }
            } catch(error) {
                console.log(error)
                this.error = error;
            } finally {
                this.loading = false;
            }
        }
    }
})