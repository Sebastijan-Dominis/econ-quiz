<script setup>
// imports
import ReturnBtn from '../components/ReturnBtn.vue';
import Dropdown from '../components/Dropdown.vue';
import { ref, reactive, onMounted, onUnmounted, watchEffect, onBeforeUnmount } from 'vue';
import DarkBtn from '../components/DarkBtn.vue';
import Popup from '../components/Popup.vue';
import { db } from '../js/firebase';
import { collection, addDoc } from 'firebase/firestore';
import CenterMessage from '../components/CenterMessage.vue';
import { useRouter } from 'vue-router';
import { useStoreEditQuiz } from '../stores/storeEditQuiz';
import AdminInstructions from '../components/AdminInstructions.vue';
import InstructionsBtn from '../components/InstructionsBtn.vue';

const router = useRouter();
const storeEditQuiz = useStoreEditQuiz();

const quizInfo = reactive({
    name: null,
    displayName: null,
    shortName: null,
    key: null,
    year: null,
    indicator: null,
    display: null,
    cannotOver100: null,
    cannotBelow0: null
})

// managing dropdowns
const isOpen1 = ref(false);
const isOpen2 = ref(false);
const isOpen3 = ref(false);
const isOpen4 = ref(false);
const dropdownMenu1 = ref(null);
const dropdownMenu2 = ref(null);
const dropdownMenu3 = ref(null);
const dropdownMenu4 = ref(null);
const onClickOutside = function(event) {
  if(
    (dropdownMenu1.value && !dropdownMenu1.value.contains(event.target)) &&
    (dropdownMenu2.value && !dropdownMenu2.value.contains(event.target)) &&
    (dropdownMenu3.value && !dropdownMenu3.value.contains(event.target)) &&
    (dropdownMenu4.value && !dropdownMenu4.value.contains(event.target))
    ) {
    isOpen1.value = false;
    isOpen2.value = false;
    isOpen3.value = false;
    isOpen4.value = false;
  }
}
onMounted(() => {
  document.addEventListener('click', onClickOutside);
})
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
})
const openDropdown = dropdown => {
    switch (dropdown) {
        case 1:
            isOpen1.value = true;
            isOpen2.value = false;
            isOpen3.value = false;
            isOpen4.value = false;
            break;
        case 2:
            isOpen1.value = false;
            isOpen2.value = true;
            isOpen3.value = false;
            isOpen4.value = false;
            break;
        case 3:
            isOpen1.value = false;
            isOpen2.value = false;
            isOpen3.value = true;
            isOpen4.value = false;
            break;
        case 4:
            isOpen1.value= false;
            isOpen2.value = false;
            isOpen3.value = false;
            isOpen4.value = true;
            break;
        default:
            break;
    }
}
const closeDropdownsAndPopups = event => {
    if(event.key === "Escape") {
        popupOpen.value = false;
        isOpen1.value = false;
        isOpen2.value = false;
        isOpen3.value = false;
        isOpen4.value = false;
        storeEditQuiz.instructions = false;
    }
}
onMounted(() => {
    document.addEventListener("keydown", closeDropdownsAndPopups);
})
onBeforeUnmount(() => {
    document.removeEventListener("keydown", closeDropdownsAndPopups);
})

// defining which years can be considered
const currYear = ref(null);
const minYear = ref(null);
const maxYear = ref(null);
onMounted(() => {
    const date = new Date();
    currYear.value = date.getFullYear();
    minYear.value = currYear.value-5;
    maxYear.value = currYear.value-1;
})

// managing the popup and adding new quiz data to the database
const popupOpen = ref(false);
const confirmation = ref(null);
const dialog = ref(null);
watchEffect(() => {
    if(dialog.value) {
        confirmation.value = dialog.value.confirmation;
    }
})
const onClickOutsidePopup = () => {
    document.removeEventListener('mousedown', onClickOutsidePopup);
    document.addEventListener('click', onClickOutsidePopup2);
}
const onClickOutsidePopup2 = event => {
    if(confirmation.value && !confirmation.value.contains(event.target)) {
        popupOpen.value = false;
        document.removeEventListener('click', onClickOutsidePopup2);
    }
}
const openPopup = () => {
    popupOpen.value = true;
    document.addEventListener('mousedown', onClickOutsidePopup);
}
const adding = ref(false);
const create = async() => {
    adding.value = true;
    document.removeEventListener('click', onClickOutsidePopup2);
    popupOpen.value = false;
    const values = Object.values(quizInfo);
    for(let i = 0; i < values.length; i++) {
        if(values[i] === null) {
            adding.value = false;
            alert("All of the values are required.");
            return;
        }
    }
    if(quizInfo.year < minYear.value || quizInfo.year > maxYear.value) {
        adding.value = false;
        alert(`Year must be between ${minYear.value} and ${maxYear.value}`);
        return;
    }
    try {
        const topics = collection(db, "topics");
        await addDoc(topics, quizInfo);
        finalMessageText.value = "You have successfully added a new quiz!";
    } catch(error) {
        console.error(error);
        finalMessageText.value = `An error occurred and your quiz was not added.\n${error}`;
    } finally {
        adding.value = false;
        finalMessage.value = true;
    }
}
const close = () => {
    document.removeEventListener('click', onClickOutsidePopup2);
    popupOpen.value = false;
}

// notifying user on whether their actions was successful or not
const finalMessage = ref(false);
const finalMessageText = ref(null);

// cleaning up the event listener
onBeforeUnmount(() => {
    document.removeEventListener('mousedown', onClickOutsidePopup);
    document.removeEventListener('click', onClickOutsidePopup2);
    adding.value = false;
    finalMessage.value = false;
    finalMessageText.value = null;
    storeEditQuiz.instructions = false;
})
</script>

<template>
    <div class="w-[85vw] h-auto md:w-auto bg-bgform border-brand border-4 rounded-3xl absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col text-brand">
        <h1 class="text-center text-2xl md:text-4xl font-bold mt-6">Add a new quiz</h1>
        <p class="text-center mt-4 md:mt-6">Fill in the form to add a new quiz</p>
        <form @submit.prevent="create" class="mt-4 md:mt-6 mx-4 md:grid md:grid-cols-2 gap-x-4 gap-y-6 items-center text-lg max-md:text-base">
            <!-- name -->
            <div class="col-span-1">
                <h2>name:</h2>
            </div>
            <div class="col-span-1">
                <input type="text" v-model="quizInfo.name" class="text-bg w-full h-6 md:h-8 px-2">
            </div>

            <!-- displayName -->
            <div class="col-span-1">
                <h2>displayName:</h2>
            </div>
            <div class="col-span-1">
                <input type="text" v-model="quizInfo.displayName" class="text-bg w-full h-6 md:h-8 px-2">
            </div>

            <!-- shortName -->
            <div class="col-span-1">
                <h2>shortName:</h2>
            </div>
            <div class="col-span-1">
                <input type="text" v-model="quizInfo.shortName" class="text-bg w-full h-6 md:h-8 px-2">
            </div>

            <!-- key -->
            <div class="col-span-1">
                <h2>key:</h2>
            </div>
            <div class="col-span-1">
                <input type="text" v-model="quizInfo.key" class="text-bg w-full h-6 md:h-8 px-2">
            </div>

            <!-- year -->
            <div class="col-span-1">
                <h2>year:</h2>
            </div>
            <div class="col-span-1">
                <input type="number" v-model="quizInfo.year" step="1" :min="minYear" :max="maxYear" class="text-bg w-full h-6 md:h-8 px-2" @input.prevent>
            </div>

            <!-- indicator -->
            <div class="col-span-1">
                <h2>indicator:</h2>
            </div>
            <div ref="dropdownMenu1" class="col-span-1">
                <button type="button" @click="openDropdown(1)" class="dropdownBtn">
                    <Dropdown :class="{'rotate-90': isOpen1}" ></Dropdown>
                    <p class="text-brand text-xs font-thin mr-2">{{ quizInfo.indicator }}</p>
                </button>
                <div v-show="isOpen1" class="mt-4 space-y-2">
                    <div class="flex items-center cursor-pointer">
                        <input class="cursor-pointer" type="radio" id="indicator1" name="indicator" value="economic" v-model="quizInfo.indicator" />
                        <label class="pl-2 cursor-pointer" for="indicator1">economic</label>
                    </div>
                    <div class="flex items-center cursor-pointer">
                        <input class="cursor-pointer" type="radio" id="indicator2" name="indicator" value="demographic" v-model="quizInfo.indicator" />
                        <label class="pl-2 cursor-pointer" for="indicator2">demographic</label>
                    </div>
                    <div class="flex items-center cursor-pointer">
                        <input class="cursor-pointer" type="radio" id="indicator3" name="indicator" value="other" v-model="quizInfo.indicator" />
                        <label class="pl-2 cursor-pointer" for="indicator3">other</label>
                    </div>
                </div>
            </div>

            <!-- display -->
            <div class="col-span-1">
                <h2>display:</h2>
            </div>
            <div ref="dropdownMenu2" class="col-span-1">
                <button type="button" @click="openDropdown(2)" class="dropdownBtn">
                    <Dropdown :class="{'rotate-90': isOpen2}" ></Dropdown>
                    <p class="text-brand text-xs font-thin mr-2">{{ quizInfo.display }}</p>
                </button>
                <div v-show="isOpen2" class="mt-4 space-y-2">
                    <div class="flex items-center cursor-pointer">
                        <input class="cursor-pointer" type="radio" id="display1" name="display" value="smallNums" v-model="quizInfo.display" />
                        <label class="pl-2 cursor-pointer" for="display1">smallNums</label>
                    </div>
                    <div class="flex items-center cursor-pointer">
                        <input class="cursor-pointer" type="radio" id="display2" name="display" value="smallNumsPercentages" v-model="quizInfo.display" />
                        <label class="pl-2 cursor-pointer" for="display2">smallNumsPercentages</label>
                    </div>
                    <div class="flex items-center cursor-pointer">
                        <input class="cursor-pointer" type="radio" id="display3" name="display" value="largeNums" v-model="quizInfo.display" />
                        <label class="pl-2 cursor-pointer" for="display3">largeNums</label>
                    </div>
                    <div class="flex items-center cursor-pointer">
                        <input class="cursor-pointer" type="radio" id="display4" name="display" value="largeNumsDollars" v-model="quizInfo.display" />
                        <label class="pl-2 cursor-pointer" for="display4">largeNumsDollars</label>
                    </div>
                </div>
            </div>

            <!-- cannotOver100 -->
            <div class="col-span-1">
                <h2>cannotOver100:</h2>
            </div>
            <div ref="dropdownMenu3" class="col-span-1">
                <button type="button" @click="openDropdown(3)" class="dropdownBtn">
                    <Dropdown :class="{'rotate-90': isOpen3}" ></Dropdown>
                    <p class="text-brand text-xs font-thin mr-2">{{ quizInfo.cannotOver100 }}</p>
                </button>
                <div v-show="isOpen3" class="mt-4 space-y-2">
                    <div class="flex items-center cursor-pointer">
                        <input class="cursor-pointer" type="radio" id="cannotOver1001" name="cannotOver100" :value="true" v-model="quizInfo.cannotOver100" />
                        <label class="pl-2 cursor-pointer" for="cannotOver1001">true</label>
                    </div>
                    <div class="flex items-center cursor-pointer">
                        <input class="cursor-pointer" type="radio" id="cannotOver1002" name="cannotOver100" :value="false" v-model="quizInfo.cannotOver100" />
                        <label class="pl-2 cursor-pointer" for="cannotOver1002">false</label>
                    </div>
                </div>
            </div>

            <!-- cannotBelow0 -->
            <div class="col-span-1">
                <h2 class="">cannotBelow0:</h2>
            </div>
            <div ref="dropdownMenu4" class="col-span-1">
                <button type="button" @click="openDropdown(4)" class="dropdownBtn">
                    <Dropdown :class="{'rotate-90': isOpen4}" ></Dropdown>
                    <p class="text-brand text-xs font-thin mr-2">{{ quizInfo.cannotBelow0 }}</p>
                </button>
                <div v-show="isOpen4" class="mt-4 space-y-2">
                    <div class="flex items-center cursor-pointer">
                        <input class="cursor-pointer" type="radio" id="cannotBelow01" name="cannotBelow0" :value="true" v-model="quizInfo.cannotBelow0" />
                        <label class="pl-2 cursor-pointer" for="cannotBelow01">true</label>
                    </div>
                    <div class="flex items-center cursor-pointer">
                        <input class="cursor-pointer" type="radio" id="cannotBelow02" name="cannotBelow0" :value="false" v-model="quizInfo.cannotBelow0" />
                        <label class="pl-2 cursor-pointer" for="cannotBelow02">false</label>
                    </div>
                </div>
            </div>

            <!-- submit button -->
            <DarkBtn @click.prevent="openPopup" class="h-12 w-40 mt-2 mb-6 justify-self-center col-span-2 max-md:flex max-md:justify-center max-md:items-center max-md:mt-6 max-md:h-10 max-md:w-28">Add</DarkBtn>

        </form>
    </div>
    <ReturnBtn></ReturnBtn>

    <!-- instructions -->
    <InstructionsBtn @click="storeEditQuiz.instructions = true"></InstructionsBtn>
    <AdminInstructions v-if="storeEditQuiz.instructions"></AdminInstructions>

    <!-- popup confirmation -->
    <div v-if="popupOpen">
        <Popup ref="dialog" @confirm="create" @decline="close">Are you sure you want to create a new quiz?</Popup>
    </div>

    <!-- final message -->
    <div v-if="adding || finalMessage">
        <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-95"></div>
        <CenterMessage v-if="adding">Adding a new quiz topic...</CenterMessage>
        <CenterMessage v-if="finalMessage">{{ finalMessageText }}</CenterMessage>
        <DarkBtn v-if="finalMessage" @click="router.push('/')" class="fixed left-1/2 transform -translate-x-1/2 bottom-40">Ok</DarkBtn>
    </div>
</template>

<style scoped>
.dropdownBtn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 2rem;
    font-size: 1.125rem;
    line-height: 1.75rem;
    font-weight: 700;
    color: var(--wg);
    background-color: var(--bgbtn);
    border: 1px solid var(--brand);
}
@media (max-width: 640px) {
    .dropdownBtn {
        height: 1.5rem;
    }
}
</style>

<!-- TODO: make the other dropdowns close when a new one opens -->