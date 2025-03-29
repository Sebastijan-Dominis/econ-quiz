// imports
import { defineStore } from 'pinia';
import { useStoreStudy } from './storeStudy';

export const useStoreQuiz = defineStore('storeQuiz', {
    state: () => {
        return {
            type: null,
            questions: [],
            correctAnswers: 0,
            manualScore: null,
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
                    "min": 0.040,
                    "max": 0.200
                }, {
                    "min": 2.000,
                    "max": 10.000
                }],
                "veryEasy": [{
                    "min": 0.080,
                    "max": 0.350
                }, {
                    "min": 1.750,
                    "max": 5.000
                }],
                "easy": [{
                    "min": 0.235,
                    "max": 0.640
                }, {
                    "min": 1.450,
                    "max": 3.500
                }],
                "normal": [{
                    "min": 0.345,
                    "max": 0.770
                }, {
                    "min": 1.250,
                    "max": 2.200
                }],
                "hard": [{
                    "min": 0.530,
                    "max": 0.850
                }, {
                    "min": 1.150,
                    "max": 1.800
                }],
                "veryHard": [{
                    "min": 0.755,
                    "max": 0.940
                }, {
                    "min": 1.050,
                    "max": 1.300
                }],
                "absoluteMadman": [{
                    "min": 0.948,
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
            },

            // these factors are only for calculating the leaderboard score
            typeFactors: {
                "Manual Input": 1.3,
                "Timed": 1.3,
                "Multiple Choice": 1
            },
            difficultiesFactors:{
                1: 1,
                2: 1.3,
                3: 1.6,
                4: 1.9,
                5: 2.2,
                6: 2.5,
                7: 2.8
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
        async createQuiz(type, choice, difficulty) {
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

                // choosing countries by how difficult they are (subjective)
                const cleared = [];

                // noob difficulty -> ideally only very easy countries
                if (difficulty === "noob") {
                    for (const [country, value] of storeStudy.countryData.value) {
                        if (storeStudy.veryEasyCountries.has(country)) cleared.push([country, value]);
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.easyCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.mediumCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.hardCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.veryHardCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                }

                // veryEasy difficulty -> ideally only easy and very easy countries
                else if(difficulty === "veryEasy") {
                    for(const [country, value] of storeStudy.countryData.value) {
                        if(storeStudy.easyCountries.has(country) || storeStudy.veryEasyCountries.has(country)) cleared.push([country, value]);
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.mediumCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.hardCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.veryHardCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                }

                // easy difficulty -> ideally only easy countries; add very easy first if need be
                else if(difficulty === "easy") {
                    for (const [country, value] of storeStudy.countryData.value) {
                        if (storeStudy.easyCountries.has(country)) cleared.push([country, value]);
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.veryEasyCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.mediumCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.hardCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.veryHardCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                }

                // normal difficulty -> ideally only easy and normal countries; add very easy first if need be
                else if(difficulty === "normal") {
                    for (const [country, value] of storeStudy.countryData.value) {
                        if (storeStudy.easyCountries.has(country) || storeStudy.mediumCountries.has(country)) cleared.push([country, value]);
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.veryEasyCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.hardCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.veryHardCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                }

                // hard difficulty -> ideally no very easy and very hard countries; add very hard first if need be
                else if (difficulty === "hard") {
                    for (const [country, value] of storeStudy.countryData.value) {
                        if (!storeStudy.veryEasyCountries.has(country) && !storeStudy.veryHardCountries.has(country)) cleared.push([country, value]);
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.veryHardCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.veryEasyCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                }

                // very hard difficulty -> ideally no very easy and easy countries
                else if(difficulty === "veryHard") {
                    for (const [country, value] of storeStudy.countryData.value) {
                        if (!storeStudy.veryEasyCountries.has(country) && !storeStudy.easyCountries.has(country)) cleared.push([country, value]);
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.easyCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.veryEasyCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                }

                // absolute madman difficulty -> ideally only hard and very hard countries
                else if(difficulty === "absoluteMadman") {
                    for (const [country, value] of storeStudy.countryData.value) {
                        if (storeStudy.hardCountries.has(country) || storeStudy.veryHardCountries.has(country)) cleared.push([country, value]);
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.mediumCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.easyCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                    if (cleared.length < 21) {
                        for (const [country, value] of storeStudy.countryData.value) {
                            if (storeStudy.veryEasyCountries.has(country)) cleared.push([country, value]);
                            if (cleared.length === 21) break;
                        }
                    }
                }

                // update the data in storeStudy
                storeStudy.countryData.value = cleared;

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

                // multiple choice quizzes and timed quizzes
                if(type === "multiple-choice" || type === "timed") {
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
                            if(storeStudy.cannotBelow0.has(choice) && answer <= 0) {
                                if(this.big) answer = '100';
                                else answer = '100.00';
                                while(same.has(answer)) {
                                    const increase = this.random(0.01, 9, 2);
                                    if(this.big) answer = Math.round(Number(answer + increase));
                                    else answer = Number(answer + increase).toFixed(2);
                                }
                            }
                            console.log(choice)
                            if(choice === "Life expectancy" && answer >= 120) {
                                if(this.big) answer = '120';
                                else answer = '120.00';
                                while(same.has(answer)) {
                                    const diminish = this.random(0.01, 9, 2);
                                    if(this.big) answer = Math.round(Number(answer-diminish));
                                    else answer = Number(answer - diminish).toFixed(2);
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
                }

                // manual input quizzes
                else if(type === "manual-input") {
                    for (const country of chosenCountries) {
                        if (signal.aborted) {
                            console.log("Quiz creation aborted while generating questions.");
                            return;
                        }

                        const current = {};
                        const question = `What is the ${choice} value for ${country[0]}?`;
                        let correct;
                        if (this.big) correct = Math.round(Number(`${country[1]}`));
                        else correct = Number(`${country[1]}`).toFixed(2);
                        current.question = question;
                        current.correct = correct;
                        this.questions.push(current);
                    }
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