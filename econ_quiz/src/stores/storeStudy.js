// imports
import { defineStore } from 'pinia'
import { ref } from 'vue';
import { useStoreQuiz } from './storeQuiz';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../js/firebase';

export const useStoreStudy = defineStore('storeStudy', {
    state: () => {
        return { 
            countryData: ref([]),
            countryDataZA: ref([]),
            countryDataHL: ref([]),
            countryDataLH: ref([]),
            loading: ref(false),       
            error: ref(null),
            // Set containing known non-country names (regions, income groups, overseas territories of some countries etc.)
            // We use a set in order to reduce the time complexity to O(n), instead of iterating through an array, which would be O(n^2). It is not possible to further improve this at the moment, but this should suffice, as the database for every indicator has just a few hundred entries, so the delay is minimal
            // We only fetch data for the widely recognized UN member states
            nonCountryNames: ref(new Set([
                "Africa Eastern and Southern", "Africa Western and Central", "American Samoa", "Arab World", "Aruba", "Bermuda", "British Virgin Islands", "Caribbean small states", "Cayman Islands", "Central Europe and the Baltics", "Channel Islands", "Curacao", "Early-demographic dividend", "East Asia & Pacific", "East Asia & Pacific (IDA & IBRD countries)", "East Asia & Pacific (excluding high income)", "Euro area", "Europe & Central Asia", "Europe & Central Asia (IDA & IBRD countries)", "Europe & Central Asia (excluding high income)", "European Union", "Faroe Islands", "Fragile and conflict affected situations", "French Polynesia", "Greenland", "Gibraltar", "Guam", "Heavily indebted poor countries (HIPC)", "High income", "Hong Kong SAR, China", "IBRD only", "IDA & IBRD total", "IDA blend", "IDA only", "IDA total", "Isle of Man", "Late-demographic dividend", "Latin America & Caribbean", "Latin America & Caribbean (excluding high income)", "Latin America & the Caribbean (IDA & IBRD countries)", "Least developed countries: UN classification", "Low & middle income", "Low income", "Lower middle income", "Macao SAR, China", "Middle East & North Africa", "Middle East & North Africa (IDA & IBRD countries)", "Middle East & North Africa (excluding high income)", "Middle income", "North America", "Northern Mariana Islands", "New Caledonia", "OECD members", "Other small states", "Pacific island small states", "Post-demographic dividend", "Pre-demographic dividend", "Puerto Rico", "Sint Maarten (Dutch part)", "Small states", "South Asia", "South Asia (IDA & IBRD)", "St. Martin (French part)", "Sub-Saharan Africa", "Sub-Saharan Africa (IDA & IBRD countries)", "Sub-Saharan Africa (excluding high income)", "Turks and Caicos Islands", "Upper middle income", "Virgin Islands (U.S.)", "World"
            ])),
            year: {},
            choiceMap: {},
            reverseChoiceMap: {},
            largeNumsDollars: ref(new Set([])),
            smallNumsPercentages: ref(new Set([])),
            largeNums: ref(new Set([])),
            smallNums: ref(new Set([])),
            cannotOver100: ref(new Set([])),
            chosenDataMap: {},
            columns: ref(
                [
                    [],
                    [],
                    [],
                ]
            ),
            allTopics: ref([]),
            allTypes: ref(["Multiple Choice", "Timed", "Manual Input"]),
            typesMap: {
                "Multiple Choice": "multiple-choice",
                "Timed": "timed",
                "Manual Input": "manual-input"
            },
            economic: new Set([]),
            demographic: new Set([]),
            other: new Set([]),
            indicators: ["economic", "demographic", "other"],
            // these classifications are somewhat biased, since there is no objective measure as to how well-known each of the countries is globally
            veryHardCountries: new Set(["Antigua and Barbuda", "Bahamas, The", "Barbados", "Brunei Darussalam", "Cabo Verde", "Congo, Rep.", "Dominica", "Dominican Republic", "Fiji", "Grenada", "Guinea-Bissau", "Kiribati", "Marshall Islands", "Mauritania", "Micronesia, Fed. Sts.", "Nauru", "Palau", "Papua New Guinea", "Samoa", "Sao Tome and Principe", "Seychelles", "Solomon Islands", "South Sudan", "St. Kitts and Nevis", "St. Lucia", "St. Vincent and the Grenadines", "Timor-Leste", "Tonga", "Trinidad and Tobago", "Tuvalu", "Vanuatu"]),
            hardCountries: new Set(["Andorra", "Angola", "Armenia", "Azerbaijan", "Bahrain", "Belize", "Bhutan", "Botswana", "Burkina Faso", "Burundi", "Cameroon", "Chad", "Comoros", "Cote d'Ivoire", "Djibouti", "Ecuador", "Equatorial Guinea", "Eswatini", "Gabon", "Gambia, The", "Ghana", "Guatemala", "Guyana", "Jamaica", "Kuwait", "Kyrgyz Republic", "Lao PDR", "Latvia", "Lebanon", "Lesotho", "Liberia", "Lithuania", "Malawi", "Maldives", "Mali", "Mauritius", "Moldova", "Mozambique", "Myanmar", "Namibia", "Nepal", "Nicaragua", "Niger", "Panama", "Paraguay", "Rwanda", "Senegal", "Sierra Leone", "Sri Lanka", "Sudan", "Suriname", "Tajikistan", "Tanzania", "Togo", "Turkmenistan", "Uganda", "Uzbekistan", "Zambia", "Zimbabwe"]),
            mediumCountries: new Set(["Afghanistan", "Albania", "Algeria", "Bangladesh", "Belarus", "Bolivia", "Bosnia and Herzegovina", "Bulgaria", "Cambodia", "Chile", "Congo, Dem. Rep.", "Costa Rica", "Cuba", "Czechia", "Denmark", "El Salvador", "Eritrea", "Estonia", "Georgia", "Haiti", "Honduras", "Iraq", "Jordan", "Kazakhstan", "Kenya", "Kosovo", "Libya", "Liechtenstein", "Madagascar", "Malaysia", "Malta", "Monaco", "Mongolia", "Montenegro", "Morocco", "North Macedonia", "Oman", "Peru", "Qatar", "San Marino", "Slovak Republic", "Slovenia", "Somalia", "Syrian Arab Republic", "Thailand", "Tunisia", "United Arab Emirates", "Uruguay", "Venezuela, RB", "Viet Nam", "West Bank and Gaza", "Yemen, Rep."]),
            easyCountries: new Set(["Argentina", "Austria", "Belgium", "Colombia", "Croatia", "Egypt, Arab Rep.", "Ethiopia", "Finland", "Hungary", "Iceland", "Ireland", "Korea, Dem. People's Rep.", "Luxembourg", "Norway", "Philippines", "Poland", "Portugal", "Romania", "Serbia", "Singapore", "South Africa", "Turkiye", "Ukraine"]),
            veryEasyCountries: new Set(["Australia", "Brazil", "Canada", "China", "France", "Germany", "Greece", "India", "Indonesia", "Iran, Islamic Rep.", "Israel", "Italy", "Japan", "Korea, Rep.", "Mexico", "Netherlands", "New Zealand", "Nigeria", "Pakistan", "Russian Federation", "Saudi Arabia", "Spain", "Sweden", "Switzerland", "United Kingdom", "United States"])
        }
    },
    actions: {
        async fetchQuizInfo() {
            const collectionRef = collection(db, "topics");
            const q = query(collectionRef);
            const topics = await getDocs(q);

            topics.forEach(doc => {
                // storing the data in variables
                const data = doc.data();
                const name = data.name;
                const shortName = data.shortName;
                const key = data.key;
                const year = data.year;
                const display = data.display;
                const indicator = data.indicator;
                const cannotOver100 = data.cannotOver100;
                const displayName = data.displayName;

                // saving display names for the buttons and categorizing topics by indicator
                if(indicator === "economic") {
                    this.economic.add(name);
                    this.columns[0].push(displayName.replace(/\\n/g, '\n'));
                } 
                else if (indicator === "demographic") {
                    this.demographic.add(name);
                    this.columns[1].push(displayName.replace(/\\n/g, '\n'));
                } 
                else if(indicator === "other") {
                    this.other.add(name);
                    this.columns[2].push(displayName.replace(/\\n/g, '\n'));
                } 

                // saving the keys
                this.chosenDataMap[name] = key;

                // saving the years
                this.year[name] = year;

                // adding to cannotOver100 to prevent the quiz algorithm from creating options that are above 100 for topics where it is impossible
                if(cannotOver100) this.cannotOver100.add(name);

                // managing how the data will be displayed
                if(display === "largeNumsDollars") this.largeNumsDollars.add(name);
                else if(display === "largeNums") this.largeNums.add(name);
                else if(display === "smallNumsPercentages") this.smallNumsPercentages.add(name);
                else if (display === "smallNums") this.smallNums.add(name);

                // creating the choice map and the reverse choice map in order to have prettier urls
                this.choiceMap[name] = shortName;
                this.reverseChoiceMap[shortName] = name;

                // storing all of the topics in one place to make results filtering easier
                this.allTopics.push(name);
            })
        },
        async fetchData(choice) {// data
                try {
                    // key
                    const chosenData = this.chosenDataMap[choice];
                    
                    // abort previous request if it exists
                    if(this.abortController) this.abortController.abort();

                    this.abortController = new AbortController();
                    const { signal } = this.abortController;

                    // clear the existing data
                    this.countryData.value = [];
        
                    this.loading = true;
                    this.error = null;
                    let page = 1;
                    let hasMoreData = true;
        
                    while (hasMoreData) {
                            const response = await fetch(`https://api.worldbank.org/v2/country/all/indicator/${chosenData}?date=${this.year[choice]}&format=json&page=${page}`, { signal });
        
                            if(signal.aborted) {
                                console.log("Request was aborted after fetch, stopping execution...");
                                return;
                            }

                            // Check if response is successful (status 200)
                            if (!response.ok) {
                                console.error("Error fetching data:", response.status);
                                break;
                            }
        
                            const data = await response.json();
        
                            if(signal.aborted) {
                                console.log("Request was aborted after parsing JSON, stopping execution...");
                                return;
                            }

                            if (data[1]) { // Ensure data[1] exists before accessing it
                                // Loop through the data for each country
                                data[1].forEach(country => {
                                    const countryName = country.country.value;
                                    const requestedValue = country.value;
        
                                    // Only include country data if it's not a region/group and GDP is valid
                                    if (requestedValue !== null && !this.nonCountryNames.has(countryName)) {
                                        this.countryData.value.push([countryName, requestedValue]);
                                    }
                                });
                            }
        
                            // Check if there are more pages
                            hasMoreData = page < data[0].pages;
                            page++;
                    }

                    if(signal.aborted) {
                        console.log("Request was aborted before sorting, stopping, execution...");
                        return;
                    }

                    this.loading = false;
        
                    this.countryDataZA.value = [...this.countryData.value].reverse();
                    this.countryDataHL.value = [...this.countryData.value].sort((a, b) => b[1] - a[1]);
                    this.countryDataLH.value = [...this.countryData.value].sort((a, b) => a[1] - b[1]);
                } catch (error) {
                    this.error = error.message;
                    this.loading = false;
                }
        },
        shuffleCountryData() {
            const storeQuiz = useStoreQuiz();
            storeQuiz.shuffle(this.countryData.value);
        }
    }
})