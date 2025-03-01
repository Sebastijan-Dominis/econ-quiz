// imports
import { defineStore } from "pinia";
import Together from "together-ai";

export const useStoreGenerator = defineStore('storeGenerator', {
    state: () => {
        return {
            key: '6f5b0bccb1b0b6360c51424dd243838583f77b5a0dfb11d3645d1dd43a2230ea',
            multiplier: new Map([
                ["noob", "75% and 89.9%"],
                ["veryEasy", "60% and 74.9%"],
                ["easy", "45% and 59.9%"],
                ["normal", "30% and 44.9%"],
                ["hard", "15% and 29.9%"],
                ["veryHard", "5% and 14.9%"],
                ["absoluteMadman", "0.1% and 4.9%"]
            ])
        }
    },
    actions: {
        async generate(choice, difficulty, numbers) {
            try{
                const together = new Together({ apiKey: this.key });
                const response = await together.chat.completions.create(
                    {
                        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
                        messages: [{ role: "user", content: `Generate an object array consisting of 20 objects. Each object should contain 3 keys, namely "question", "options" and "correct". "options" is an array that consists of 4 keys, namely "optionA", "optionB", "optionC" and "optionD". I only want a json object that i described, so no yapping please, no signs of json formatting, and no unnecessary data like "{"objects": [...]}". Just a raw json object of precisely what i asked for. The wrong options should be random numbers, and should only be between ${multiplier[difficulty]} higher or lower than the correct answer. "question" is a string, "optionA", "optionB", "optionC", "optionD" and "correct" are numbers, such that only one "option" equals "correct". Note that the questions should all be related to these numbers: ${numbers}. They should ask what the ${choice} of some country is, and the countries asked about should be random, so don't just go alphabetically.` }]
                    }
                );
                const data = JSON.parse(response.choices[0].message.content);
                return data;
            } catch(error) {
                console.log(error);
                return "Failed to generate questions.";
            }
        }
    }
})