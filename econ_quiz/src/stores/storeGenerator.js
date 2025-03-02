// // imports
// import { defineStore } from "pinia";
// import Together from "together-ai";

// export const useStoreGenerator = defineStore('storeGenerator', {
//     state: () => {
//         return {
//             key: '6f5b0bccb1b0b6360c51424dd243838583f77b5a0dfb11d3645d1dd43a2230ea',
//             multiplier: new Map([
//                 ["noob", "0.100 and 0.249 or 1.750 and 1.899"],
//                 ["veryEasy", "0.250 and 0.399 or 1.600 and 1.749"],
//                 ["easy", "45% and 59.9%"],
//                 ["normal", "30% and 44.9%"],
//                 ["hard", "15% and 29.9%"],
//                 ["veryHard", "5% and 14.9%"],
//                 ["absoluteMadman", "0.1% and 4.9%"]
//             ])
//         }
//     },
//     actions: {
//         async generate(choice, difficulty, numbers) {
//             try{
//                 const together = new Together({ apiKey: this.key });
//                 const response = await together.chat.completions.create(
//                     {
//                         model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
//                         messages: [{ role: "user", content: `Generate an object array that i will hereon refer to as "quiz", consisting of 20 objects. Each object should contain 3 keys, namely "question", "options" and "correct". "options" should be an array that contains 4 elements. I only want a json object "quiz" that i described, so no yapping please, no signs of json formatting, and no unnecessary data like "{"quiz": [...]}". Just a raw json object of precisely what i asked for. So that is the general structure, and now I will explain the details. "question" is a string, while "options" and "correct" are numbers, such that only one value of the "options" array should equal "correct", and none of the values from the "options" array should equal each other. The three values of the "options" array that do not equal correct should be gotten by multiplying the correct answer with a random decimal number between ${this.multiplier[difficulty]}. Note that the questions should all be related to these numbers: ${numbers}. They should ask what the ${choice} of some country is, and the countries asked about should be random, so don't just go alphabetically.` }]
//                     }
//                 );
//                 const data = JSON.parse(response.choices[0].message.content);
//                 console.log(data);
//                 return data;
//             } catch(error) {
//                 console.log(error);
//                 return "Failed to generate questions.";
//             }
//         }
//     }
// })