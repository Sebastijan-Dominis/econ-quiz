// stores/storeStudy.js
import { defineStore } from 'pinia'

// other imports
import { ref } from 'vue';

export const useStoreStudy = defineStore('storeStudy', {
    state: () => {
        return { 
            choice: null,
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
                "Africa Eastern and Southern", "Africa Western and Central", "Arab World", "Aruba", "Bermuda", "Caribbean small states", "Cayman Islands", "Central Europe and the Baltics", "Channel Islands", "Curacao", "Early-demographic dividend", "East Asia & Pacific", "East Asia & Pacific (IDA & IBRD countries)", "East Asia & Pacific (excluding high income)", "Euro area", "Europe & Central Asia", "Europe & Central Asia (IDA & IBRD countries)", "Europe & Central Asia (excluding high income)", "European Union", "Faroe Islands", "Fragile and conflict affected situations", "Heavily indebted poor countries (HIPC)", "High income", "Hong Kong SAR, China", "IBRD only", "IDA & IBRD total", "IDA blend", "IDA only", "IDA total", "Late-demographic dividend", "Latin America & Caribbean", "Latin America & Caribbean (excluding high income)", "Latin America & the Caribbean (IDA & IBRD countries)", "Least developed countries: UN classification", "Low & middle income", "Low income", "Lower middle income", "Macao SAR, China", "Middle East & North Africa", "Middle East & North Africa (IDA & IBRD countries)", "Middle East & North Africa (excluding high income)", "Middle income", "North America", "OECD members", "Other small states", "Pacific island small states", "Post-demographic dividend", "Pre-demographic dividend", "Puerto Rico", "Sint Maarten (Dutch part)", "Small states", "South Asia", "South Asia (IDA & IBRD)", "Sub-Saharan Africa", "Sub-Saharan Africa (IDA & IBRD countries)", "Sub-Saharan Africa (excluding high income)", "Turks and Caicos Islands", "Upper middle income", "World"
            ])),
            exceptions2022: ref(new Set(["Fertility rate", "Life expectancy", "Literacy rate", "Poverty headcount ratio", "Arable land (% of land area)", "Forest area (% of land area)", "Internet users (% of population)"])),
            exceptions2021: ref(new Set(["Health spending (% of GDP)"])),
            exceptions2020: ref(new Set(['Maternal mortality ratio (per 100k births)']))
        }
    },
    actions: {
        async fetchData(choice) {// data
            let chosenData = "";
            
            // year
            let year = "2023";
            if(this.exceptions2022.has(choice)) year = "2022";
            if(this.exceptions2021.has(choice)) year = "2021";
            if(this.exceptions2020.has(choice)) year = "2020";

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
            else if (choice === "Dependency ratio") chosenData = "SP.POP.DPND";
            else if (choice === "Literacy rate") chosenData = "SE.ADT.LITR.ZS";
            else if (choice === "Poverty headcount ratio") chosenData = "SI.POV.DDAY";
            else if (choice === "Health spending (% of GDP)") chosenData = "SH.XPD.CHEX.GD.ZS";
            else if (choice === "Arable land (% of land area)") chosenData = "AG.LND.ARBL.ZS";
            else if (choice === "Forest area (% of land area)") chosenData = "AG.LND.FRST.ZS";
            else if (choice === "Net migration") chosenData = "SM.POP.NETM";
            else if (choice === "Maternal mortality ratio (per 100k births)") chosenData = "SH.STA.MMRT";
            else if (choice === "Internet users (% of population)") chosenData = "IT.NET.USER.ZS";

            // clearing the data
            this.countryData.value = [];

            this.loading = true;
            this.error = null;
            let page = 1;
            let hasMoreData = true;

            while (hasMoreData) {
                try {

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
                } catch(error) {
                    this.error = error.message;
                    this.loading = false;
                    return;
                }
            }

            this.loading = false;
            
            this.countryDataZA.value = [...this.countryData.value].reverse();
            this.countryDataHL.value = [...this.countryData.value].sort((a, b) => b[1] - a[1]);
            this.countryDataLH.value = [...this.countryData.value].sort((a, b) => a[1] - b[1]);
        }
    }
})