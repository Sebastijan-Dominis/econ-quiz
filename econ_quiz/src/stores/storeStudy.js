// imports
import { defineStore } from 'pinia'
import { ref } from 'vue';
import { useStoreQuiz } from './storeQuiz';

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
                "Africa Eastern and Southern", "Africa Western and Central", "American Samoa", "Arab World", "Aruba", "Bermuda", "British Virgin Islands", "Caribbean small states", "Cayman Islands", "Central Europe and the Baltics", "Channel Islands", "Curacao", "Early-demographic dividend", "East Asia & Pacific", "East Asia & Pacific (IDA & IBRD countries)", "East Asia & Pacific (excluding high income)", "Euro area", "Europe & Central Asia", "Europe & Central Asia (IDA & IBRD countries)", "Europe & Central Asia (excluding high income)", "European Union", "Faroe Islands", "Fragile and conflict affected situations", "French Polynesia", "Greenland", "Heavily indebted poor countries (HIPC)", "High income", "Hong Kong SAR, China", "IBRD only", "IDA & IBRD total", "IDA blend", "IDA only", "IDA total", "Isle of Man", "Late-demographic dividend", "Latin America & Caribbean", "Latin America & Caribbean (excluding high income)", "Latin America & the Caribbean (IDA & IBRD countries)", "Least developed countries: UN classification", "Low & middle income", "Low income", "Lower middle income", "Macao SAR, China", "Middle East & North Africa", "Middle East & North Africa (IDA & IBRD countries)", "Middle East & North Africa (excluding high income)", "Middle income", "North America", "Northern Mariana Islands", "New Caledonia", "OECD members", "Other small states", "Pacific island small states", "Post-demographic dividend", "Pre-demographic dividend", "Puerto Rico", "Sint Maarten (Dutch part)", "Small states", "South Asia", "South Asia (IDA & IBRD)", "St. Martin (French part)", "Sub-Saharan Africa", "Sub-Saharan Africa (IDA & IBRD countries)", "Sub-Saharan Africa (excluding high income)", "Turks and Caicos Islands", "Upper middle income", "Virgin Islands (U.S.)", "World"
            ])),
            exceptions2022: ref(new Set(["Fertility rate", "Life expectancy", "Literacy rate", "Poverty headcount ratio", "Arable land (% of land area)", "Forest area (% of land area)", "Internet users (% of population)"])),
            exceptions2021: ref(new Set(["Health spending (% of GDP)", "Diabetes as % of people ages 20 to 79"])),
            exceptions2020: ref(new Set(["Maternal mortality ratio (per 100k births)"])),
            choiceMap: {
                "Nominal GDP": "nom_gdp",
                "GDP PPP": "gdp_ppp",
                "Nominal GDP p/c": "nom_gdp_pc",
                "GDP PPP p/c": "gdp_ppp_pc",
                "Exports as % of GDP": "exports",
                "Imports as % of GDP": "imports",
                "Inflation": "inflation",
                "Unemployment": "unemployment",
                "Total population": "population",
                "Population growth rate": "pop_growth",
                "Population 65+ (% of total)": "pop65up",
                "Population 0-14 (% of total)": "pop0014",
                "Urban population (% of total)": "urban_pop",
                "Fertility rate": "tfr",
                "Life expectancy": "life_expectancy",
                "Net migration": "migration",
                "Literacy rate": "literacy",
                "Poverty headcount ratio": "poverty_headcount_ratio",
                "Health spending (% of GDP)": "health_spending",
                "Arable land (% of land area)": "arable_area",
                "Forest area (% of land area)": "forest_area",
                "Diabetes as % of people ages 20 to 79": "diabetes_20to79",
                "Maternal mortality ratio (per 100k births)": "maternal_mortality",
                "Internet users (% of population)": "internet_users"
            },
            reverseChoiceMap: {
                "nom_gdp": "Nominal GDP",
                "gdp_ppp": "GDP PPP",
                "nom_gdp_pc": "Nominal GDP p/c",
                "gdp_ppp_pc": "GDP PPP p/c",
                "exports": "Exports as % of GDP",
                "imports": "Imports as % of GDP",
                "inflation": "Inflation",
                "unemployment": "Unemployment",
                "population": "Total population",
                "pop_growth": "Population growth rate",
                "pop65up": "Population 65+ (% of total)",
                "pop0014": "Population 0-14 (% of total)",
                "urban_pop": "Urban population (% of total)",
                "tfr": "Fertility rate",
                "life_expectancy": "Life expectancy",
                "migration": "Net migration",
                "literacy": "Literacy rate",
                "poverty_headcount_ratio": "Poverty headcount ratio",
                "health_spending": "Health spending (% of GDP)",
                "arable_area": "Arable land (% of land area)",
                "forest_area": "Forest area (% of land area)",
                "diabetes_20to79": "Diabetes as % of people ages 20 to 79",
                "maternal_mortality": "Maternal mortality ratio (per 100k births)",
                "internet_users": "Internet users (% of population)"
            },
            largeNumsDollars: ref(new Set(['Nominal GDP', 'GDP PPP', 'Nominal GDP p/c', 'GDP PPP p/c'])),
            smallNumsPercentages: ref(new Set(['Exports as % of GDP', 'Imports as % of GDP', 'Inflation', 'Unemployment', 'Population growth rate', 'Population 65+ (% of total)', 'Population 0-14 (% of total)', 'Urban population (% of total)', 'Literacy rate', 'Poverty headcount ratio', 'Health spending (% of GDP)', 'Arable land (% of land area)', 'Forest area (% of land area)', 'Internet users (% of population)', 'Diabetes as % of people ages 20 to 79'])),
            largeNums: ref(new Set(['Total population', 'Net migration', 'Maternal mortality ratio (per 100k births)'])),
            smallNums: ref(new Set(['Fertility rate', 'Life expectancy'])),
            cannotOver100: ref(new Set(['Unemployment', 'Population 65+ (% of total)', 'Population 0-14 (% of total)', 'Urban population (% of total)', 'Literacy rate', 'Poverty headcount ratio', 'Health spending (% of GDP)', 'Arable land (% of land area)', 'Forest area (% of land area)', 'Internet users (% of population)', 'Diabetes as % of people ages 20 to 79']))
        }
    },
    actions: {
        async fetchData(choice) {// data
            return new Promise(async (resolve, reject) => {
                try {
                    let chosenData = "";
                    // year
                    const year = this.getYear(choice);
        
                    // key
                    if (choice === "Nominal GDP") chosenData = "NY.GDP.MKTP.CD";
                    else if (choice === "GDP PPP") chosenData = "NY.GDP.MKTP.PP.CD";
                    else if (choice === "Nominal GDP p/c") chosenData = "NY.GDP.PCAP.CD";
                    else if (choice === "GDP PPP p/c") chosenData = "NY.GDP.PCAP.PP.CD";
                    else if (choice === "Exports as % of GDP") chosenData = "NE.EXP.GNFS.ZS";
                    else if (choice === "Imports as % of GDP") chosenData = "NE.IMP.GNFS.ZS";
                    else if (choice === "Inflation") chosenData = "FP.CPI.TOTL.ZG";
                    else if (choice === "Unemployment") chosenData = "SL.UEM.TOTL.ZS";
                    else if (choice === "Total population") chosenData = "SP.POP.TOTL";
                    else if (choice === "Population growth rate") chosenData = "SP.POP.GROW";
                    else if (choice === "Population 65+ (% of total)") chosenData = "SP.POP.65UP.TO.ZS";
                    else if (choice === "Population 0-14 (% of total)") chosenData = "SP.POP.0014.TO.ZS";
                    else if (choice === "Urban population (% of total)") chosenData = "SP.URB.TOTL.IN.ZS";
                    else if (choice === "Fertility rate") chosenData = "SP.DYN.TFRT.IN";
                    else if (choice === "Life expectancy") chosenData = "SP.DYN.LE00.IN";
                    else if (choice === "Literacy rate") chosenData = "SE.ADT.LITR.ZS";
                    else if (choice === "Poverty headcount ratio") chosenData = "SI.POV.DDAY";
                    else if (choice === "Health spending (% of GDP)") chosenData = "SH.XPD.CHEX.GD.ZS";
                    else if (choice === "Arable land (% of land area)") chosenData = "AG.LND.ARBL.ZS";
                    else if (choice === "Forest area (% of land area)") chosenData = "AG.LND.FRST.ZS";
                    else if (choice === "Net migration") chosenData = "SM.POP.NETM";
                    else if (choice === "Maternal mortality ratio (per 100k births)") chosenData = "SH.STA.MMRT";
                    else if (choice === "Internet users (% of population)") chosenData = "IT.NET.USER.ZS";
                    else if (choice === "Diabetes as % of people ages 20 to 79") chosenData = "SH.STA.DIAB.ZS";
        
                    // clearing the data
                    this.countryData.value = [];
        
                    this.loading = true;
                    this.error = null;
                    let page = 1;
                    let hasMoreData = true;
        
                    while (hasMoreData) {
                            const response = await fetch(`https://api.worldbank.org/v2/country/all/indicator/${chosenData}?date=${year}&format=json&page=${page}`);
        
                            // Check if response is successful (status 200)
                            if (!response.ok) {
                                console.error("Error fetching data:", response.status);
                                break;
                            }
        
                            const data = await response.json();
        
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
                    this.loading = false;
        
                    this.countryDataZA.value = [...this.countryData.value].reverse();
                    this.countryDataHL.value = [...this.countryData.value].sort((a, b) => b[1] - a[1]);
                    this.countryDataLH.value = [...this.countryData.value].sort((a, b) => a[1] - b[1]);
                    resolve();
                } catch (error) {
                    this.error = error.message;
                    this.loading = false;
                    reject(error);
                }
            })
        },
        getYear(choice) {
            let year = "2023";
            if (this.exceptions2022.has(choice)) year = "2022";
            if (this.exceptions2021.has(choice)) year = "2021";
            if (this.exceptions2020.has(choice)) year = "2020";
            return year;
        },
        shuffleCountryData() {
            const storeQuiz = useStoreQuiz();
            storeQuiz.shuffle(this.countryData.value);
        }
    }
})