// imports
import { defineStore } from 'pinia';
import { useStoreStudy } from './storeStudy';

export const useStoreQuiz = defineStore('storeQuiz', {
    state: () => {
        return {
            storeStudy: useStoreStudy(),
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

        // helps to take random countries so they are unique each time a new quiz is created
        random(min, max, decimals) {
            const rand = Math.random() * (max - min) + min;
            const factor = Math.pow(10, decimals);
            return Math.round(rand * factor) / factor;
        },

        // prevents identical values which is especially important for the absolute madman difficulty, which has a very small multiplier
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

        // adds only countries appropriate for the difficulty level
        appropriate(difficulty) {
            const cleared = [];

            // noob difficulty -> ideally only very easy countries
            if (difficulty === "noob") {
                for (const [country, value] of this.storeStudy.countryData.value) {
                    if (this.storeStudy.veryEasyCountries.has(country)) cleared.push([country, value]);
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.easyCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.mediumCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.hardCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.veryHardCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
            }

            // veryEasy difficulty -> ideally only easy and very easy countries
            else if (difficulty === "veryEasy") {
                for (const [country, value] of this.storeStudy.countryData.value) {
                    if (this.storeStudy.easyCountries.has(country) || this.storeStudy.veryEasyCountries.has(country)) cleared.push([country, value]);
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.mediumCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.hardCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.veryHardCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
            }

            // easy difficulty -> ideally only easy countries; add very easy first if need be
            else if (difficulty === "easy") {
                for (const [country, value] of this.storeStudy.countryData.value) {
                    if (this.storeStudy.easyCountries.has(country)) cleared.push([country, value]);
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.veryEasyCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.mediumCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.hardCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.veryHardCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
            }

            // normal difficulty -> ideally only easy and normal countries; add very easy first if need be
            else if (difficulty === "normal") {
                for (const [country, value] of this.storeStudy.countryData.value) {
                    if (this.storeStudy.easyCountries.has(country) || this.storeStudy.mediumCountries.has(country)) cleared.push([country, value]);
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.veryEasyCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.hardCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.veryHardCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
            }

            // hard difficulty -> ideally no very easy and very hard countries; add very hard first if need be
            else if (difficulty === "hard") {
                for (const [country, value] of this.storeStudy.countryData.value) {
                    if (!this.storeStudy.veryEasyCountries.has(country) && !this.storeStudy.veryHardCountries.has(country)) cleared.push([country, value]);
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.veryHardCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.veryEasyCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
            }

            // very hard difficulty -> ideally no very easy and easy countries
            else if (difficulty === "veryHard") {
                for (const [country, value] of this.storeStudy.countryData.value) {
                    if (!this.storeStudy.veryEasyCountries.has(country) && !this.storeStudy.easyCountries.has(country)) cleared.push([country, value]);
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.easyCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.veryEasyCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
            }

            // absolute madman difficulty -> ideally only hard and very hard countries
            else if (difficulty === "absoluteMadman") {
                for (const [country, value] of this.storeStudy.countryData.value) {
                    if (this.storeStudy.hardCountries.has(country) || this.storeStudy.veryHardCountries.has(country)) cleared.push([country, value]);
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.mediumCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.easyCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
                if (cleared.length < 21) {
                    for (const [country, value] of this.storeStudy.countryData.value) {
                        if (this.storeStudy.veryEasyCountries.has(country)) cleared.push([country, value]);
                        if (cleared.length === 21) break;
                    }
                }
            }
            return cleared;
        },
        
        // prevents options that make no sense, or are too obvious
        preventIllogical(answer, choice, same) {
            const over100Restricted = this.storeStudy.cannotOver100.has(choice);
            const under0Restricted = this.storeStudy.cannotBelow0.has(choice);
            const lifeExpectancy = choice === "Life expectancy";

            let value = Number(answer);
            let attempts = 0;

            while (true) {
                // Clamp before formatting
                if (over100Restricted && value > 100) value = 100;
                if (under0Restricted && value < 0) value = 0;
                if (lifeExpectancy && value > 120) value = 120;

                let formatted = this.big ? Math.round(value).toString() : value.toFixed(2);

                if (!same.has(formatted)) break;

                const adjust = this.random(0.01, 5, 3);
                const direction = Math.random() < 0.5 ? -1 : 1;
                value += adjust * direction;

                // Clamp after adjustment
                if (over100Restricted && value > 100) value = 100;
                if (under0Restricted && value < 0) value = 0;
                if (lifeExpectancy && value > 120) value = 120;

                attempts++;
                if (attempts > 500) {
                    console.warn("preventIllogical exceeded 500 attempts, forcing fallback value.");

                    const fallbackAdjust = this.random(0.01, 10, 3);

                    if (over100Restricted) {
                        // Start from 100 and diminish by random 0.01 to 10
                        value = 100 - fallbackAdjust;
                    } else if (lifeExpectancy) {
                        // Start from 120 and diminish by random 0.01 to 10
                        value = 120 - fallbackAdjust;
                    } else if (under0Restricted) {
                        // Start from 0 and increase by random 0.01 to 10
                        value = 0 + fallbackAdjust;
                    } else {
                        // Fallback generic nudge if no restrictions apply
                        value = value + Math.random();
                    }

                    // Clamp one last time in case adjustment broke the limits
                    if (over100Restricted && value > 100) value = 100;
                    if (under0Restricted && value < 0) value = 0;
                    if (lifeExpectancy && value > 120) value = 120;

                    break;
                }
            }

            return this.big ? Math.round(value).toString() : value.toFixed(2);
        },



        // generating questions for multiple choice and timed quizzes
        generateQuestionsMCT(chosenCountries, choice, difficulty) {
            for (const country of chosenCountries) {
                const current = {};
                const question = `What is the ${choice} value for ${country[0]}?`;
                let correct;
                if (this.big) correct = Math.round(Number(`${country[1]}`));
                else correct = Number(`${country[1]}`).toFixed(2);
                const options = [correct];
                const same = new Set();
                same.add(correct);
                for (let i = 0; i < 3;) {
                    // randomly deciding whether the false option will be higher or lower than the correct answer
                    const upOrDown = this.random(0, 1, 0);

                    // fetching the factors that determine how much smaller or big the false option's value is allowed to be depending on the difficulty
                    const minFactor = this.multipliers[difficulty][upOrDown].min;
                    const maxFactor = this.multipliers[difficulty][upOrDown].max;
                    const min = minFactor * correct;
                    const max = maxFactor * correct;

                    // returns a random value in a given range
                    let answer = this.random(min, max, 4);

                    // formats the option appropriately
                    if (this.big) answer = Math.round(answer);
                    else answer = Number(answer).toFixed(2);

                    // prevents illogical values
                    answer = this.preventIllogical(answer, choice, same)

                    same.add(answer);
                    options.push(Number(answer));
                    i++;
                }

                // shuffling options to make the position of the correct answer unpredictable
                this.shuffle(options);
                current.question = question;
                current.options = options;
                current.correct = correct;
                this.questions.push(current);
            }
        },

        // generating questions for manual input quizzes
        generateQuestionsMI(chosenCountries, choice) {
            for (const country of chosenCountries) {
                const current = {};
                const question = `What is the ${choice} value for ${country[0]}?`;
                let correct;
                if (this.big) correct = Math.round(Number(`${country[1]}`));
                else correct = Number(`${country[1]}`).toFixed(2);
                current.question = question;
                current.correct = correct;
                this.questions.push(current);
            }
        },

        // main function that creates a quiz
        async createQuiz(type, choice, difficulty) {
            this.loading = true;
            try {
                // allows stopping the code execution at the main gridlock if user quit starting one quiz and decided to start another one instead
                if(this.abortController) this.abortController.abort();

                this.abortController = new AbortController();
                const { signal } = this.abortController;

                this.questions = [];
                this.correctAnswers = 0;
                
                this.big = this.storeStudy.largeNumsDollars.has(choice) || this.storeStudy.largeNums.has(choice);
                
                await this.storeStudy.fetchData(choice);

                // stopping the code execution if necessary after the main gridlock (data fetch via an api)
                if(signal.aborted) {
                    "Quiz creation aborted after fetching data.";
                    return;
                }

                // including only questions for countries appropriate considering the difficulty
                const cleared = this.appropriate(difficulty);
                
                // update the data in storeStudy
                this.storeStudy.countryData.value = cleared;

                // shuffling the country data for randomness
                this.storeStudy.shuffleCountryData();

                // adding 21 countries -> 20 will be used but starting from the first index makes things easier
                const numbers = [...this.storeStudy.countryData.value];
                const chosenCountries = new Set();
                while(chosenCountries.size <= 20) {
                    // choosing random countries
                    const curr = this.random(0, numbers.length-1, 0);
                    chosenCountries.add(numbers[curr]);
                }

                // generating questions for multiple choice quizzes and timed quizzes
                if(type === "multiple-choice" || type === "timed") {
                    this.generateQuestionsMCT(chosenCountries, choice, difficulty);
                }

                // generating questions for manual input quizzes
                else if(type === "manual-input") {
                    this.generateQuestionsMI(chosenCountries, choice);
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