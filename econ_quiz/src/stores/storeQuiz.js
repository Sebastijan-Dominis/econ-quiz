// imports
import { defineStore } from 'pinia';
import { useStoreStudy } from './storeStudy';

export const useStoreQuiz = defineStore('storeQuiz', {
    state: () => {
        return {
            type: null,
            questions: [],
            correctAnswers: 0,
            loading: false,
            error: null,
            // noob: 100% - 900%; 70%
            // veryEasy: 75% - 400%; 55%
            // easy: 45% - 250%; 35%
            // normal: 25% - 120%; 15%
            // hard: 15% - 80%; 10%
            // veryHard: 5% - 30%; 3%
            // absoluteMadman: 0.01% - 5%
            multipliers: {
                "noob": [{
                    "min": 0.100,
                    "max": 0.500
                }, {
                    "min": 2.000,
                    "max": 10.000
                }],
                "veryEasy": [{
                    "min": 0.200,
                    "max": 0.570
                }, {
                    "min": 1.750,
                    "max": 5.000
                }],
                "easy": [{
                    "min": 0.286,
                    "max": 0.690
                }, {
                    "min": 1.450,
                    "max": 3.500
                }],
                "normal": [{
                    "min": 0.455,
                    "max": 0.800
                }, {
                    "min": 1.250,
                    "max": 2.200
                }],
                "hard": [{
                    "min": 0.555,
                    "max": 0.870
                }, {
                    "min": 1.150,
                    "max": 1.800
                }],
                "veryHard": [{
                    "min": 0.770,
                    "max": 0.952
                }, {
                    "min": 1.050,
                    "max": 1.300
                }],
                "absoluteMadman": [{
                    "min": 0.952,
                    "max": 0.999
                }, {
                    "min": 1.001,
                    "max": 1.050
                }]
            },
            closeValues: {
                "noob": {
                    "higherFactor": 1.700,
                    "lowerFactor": 0.588
                },
                "veryEasy": {
                    "higherFactor": 1.550,
                    "lowerFactor": 0.645
                },
                "easy": {
                    "higherFactor": 1.350,
                    "lowerFactor": 0.740
                },
                "normal": {
                    "higherFactor": 1.150,
                    "lowerFactor": 0.870
                },
                "hard": {
                    "higherFactor": 1.100,
                    "lowerFactor":0.909
                },
                "veryHard": {
                    "higherFactor": 1.030,
                    "lowerFactor": 0.971
                }
            },
            big: true,
            difficultiesMap: {
                noob: 1,
                veryEasy: 2,
                easy: 3,
                normal: 4,
                hard: 5,
                veryHard: 6,
                absoluteMadman: 7
            },
            difficultiesMapReverse: {
                1: "Noob",
                2: "Very easy",
                3: "Easy",
                4: "Normal",
                5: "Hard",
                6: "Very hard",
                7: "Absolute madman"
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

        // helps to take random countries, so they are unique each time a new quiz is created
        random(min, max, decimals) {
            const rand = Math.random() * (max - min) + min;
            const factor = Math.pow(10, decimals);
            return Math.round(rand * factor) / factor;
        },

        // prevents identical values, which is especially important for the absolute madman difficulty, which has a very small multiplier
        addOrSubtract(number) {
            let rand = Math.random();
            let change;
            if(this.big) {
                change = 1;
                if(rand >= 0.5) return Number(number) + change;
                else return Number(number) - change;
            }
            else {
                change = 0.01;
                if (rand >= 0.5) return (Number(number) + change).toFixed(2);
                else return (Number(number) - change).toFixed(2);
            }
        },
        
        // prevents values that are too similar to each, thus implying an answer, but still doesn't create an overly wide range of values for the difficulty in question
        checkIfTooClose(answer, difficulty, same) {
            if(difficulty === "absoluteMadman") return answer;
            const lowerFactor = this.closeValues[difficulty].lowerFactor;
            const higherFactor = this.closeValues[difficulty].higherFactor;
            for(const existingAnswer of same) {
                const low = answer * lowerFactor;
                const high = answer * higherFactor;

                if(existingAnswer > low && existingAnswer < high) {
                    const rand = Math.random();
                    answer = rand >= 0.5 ? answer * lowerFactor : answer * higherFactor;

                    return this.checkIfTooClose(answer, difficulty, same);
                }
            }
            
            return this.big ? Math.round(answer) : Number(answer).toFixed(2);
        },

        // main function that creates a quiz
        async createQuiz(choice, difficulty) {
            this.loading = true;
            try {
                if(this.abortController) this.abortController.abort();

                this.abortController = new AbortController();
                const { signal } = this.abortController;

                this.questions = [];
                this.correctAnswers = 0;
                const storeStudy = useStoreStudy();
                this.big = storeStudy.largeNumsDollars.has(choice) || storeStudy.largeNums.has(choice);
                
                await storeStudy.fetchData(choice);
                if(signal.aborted) {
                    "Quiz creation aborted after fetching data.";
                    return;
                }

                storeStudy.shuffleCountryData();
                if (signal.aborted) {
                    console.log("Quiz creation aborted after shuffling data.");
                    return;
                }

                const numbers = [...storeStudy.countryData.value];
                const chosenCountries = new Set();
                while(chosenCountries.size <= 20) {
                    if (signal.aborted) {
                        console.log("Quiz creation aborted while selecting countries.");
                        return;
                    }
                    const curr = this.random(0, numbers.length-1, 0);
                    chosenCountries.add(numbers[curr]);
                }

                // multiple choice quizzes
                for(const country of chosenCountries) {
                    if (signal.aborted) {
                        console.log("Quiz creation aborted while generating questions.");
                        return;
                    }

                    const current = {};
                    const question = `What is the ${choice} value for ${country[0]}?`;
                    let correct;
                    if(this.big) correct = Math.round(Number(`${country[1]}`));
                    else correct = Number(`${country[1]}`).toFixed(2);
                    const options = [correct];
                    const same = new Set();
                    same.add(correct);
                    for(let i = 0; i < 3; ) {
                        if (signal.aborted) {
                            console.log("Quiz creation aborted while generating options.");
                            return;
                        }

                        const upOrDown = this.random(0, 1, 0);
                        const minFactor = this.multipliers[difficulty][upOrDown].min;
                        const maxFactor = this.multipliers[difficulty][upOrDown].max;
                        const min = minFactor * correct;
                        const max = maxFactor * correct;
                        let answer = this.random(min, max, 4);
                        if(this.big) answer = Math.round(answer);
                        else answer = Number(answer).toFixed(2);
                        answer = this.checkIfTooClose(answer, difficulty, same);
                        if(storeStudy.cannotOver100.has(choice) && answer >= 100) {
                            if(this.big) answer = '100';
                            else answer = '100.00';
                            while(same.has(answer)) {
                                const diminish = this.random(0.01, 9, 2);
                                if(this.big) answer = Math.round(Number(answer-diminish));
                                else answer = Number(answer - diminish).toFixed(2);
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