<script setup>
// imports
import PageTop from '../components/PageTop.vue';
import Choice from '../components/Choice.vue';
import { useStoreEditQuiz } from '../stores/storeEditQuiz';
import DarkBtn from '../components/DarkBtn.vue';
import { ref, watchEffect, onBeforeUnmount } from 'vue';
import Popup from '../components/Popup.vue';
import { db } from '../js/firebase';
import { collection, doc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import CenterMessage from '../components/CenterMessage.vue';

const storeEditQuiz = useStoreEditQuiz();
const router = useRouter();

// deleting a topic
const deletePopup = ref(false);
const confirmation = ref(null);
const dialog1 = ref(null);
const dialog2 = ref(null);
watchEffect(() => {
    if(dialog1.value) {
        confirmation.value = dialog1.value;
        document.addEventListener('mousedown', onClickOutside);
    }
    if(dialog2.value) {
        confirmation.value = dialog2.value.confirmation;
    }
})
const onClickOutsideChoice = () => {
    document.removeEventListener('mousedown', onClickOutsideChoice);
    document.addEventListener('click', onClickOutsideChoice2);
}
const onClickOutsideChoice2 = () => {
    if(confirmation.value && !confirmation.value.contains(event.target)) {
        deletePopup.value = false;
        document.removeEventListener('click', onClickOutsideChoice2);
    }
}
const onClickOutside = () => {
    document.removeEventListener('mousedown', onClickOutside);
    document.addEventListener('click', onClickOutside2);
}
const onClickOutside2 = event => {
    if(confirmation.value && !confirmation.value.contains(event.target)) {
        storeEditQuiz.editOrDelete = false;
        document.removeEventListener('click', onClickOutside2);
    }
}
const activatingEdit = ref(false);
const activateEditError = ref(false);
const handleEdit = async() => {
    activatingEdit.value = true;
    const topicsRef = collection(db, "topics");
    const q = query(topicsRef, where("displayName", "==", storeEditQuiz.chosenTopic));
    console.log(storeEditQuiz.chosenTopic)
    try {
        const snapshot = await getDocs(q);
        const topicDoc = snapshot.docs[0];
        storeEditQuiz.topicID = topicDoc.id;
        const topic = topicDoc.data();
        const info = storeEditQuiz.currTopic;
        info.name = topic.name;
        info.displayName = topic.displayName;
        info.display = topic.display;
        info.shortName = topic.shortName;
        info.indicator = topic.indicator;
        info.key = topic.key;
        info.year = topic.year;
        info.cannotOver100 = topic.cannotOver100;
        info.cannotBelow0 = topic.cannotBelow0;
        document.removeEventListener('click', onClickOutside2);
        storeEditQuiz.editOrDelete = false;
        router.push({name: 'edit', params: {choice: storeEditQuiz.chosenTopic}});
    } catch(error) {
        activateEditError.value = true;
        console.error(error);
    } finally {
        activatingEdit.value = false;
    }
}
const handleDelete = () => {
    deletePopup.value = true;
    document.removeEventListener('click', onClickOutside2);
    storeEditQuiz.editOrDelete = false;
    document.addEventListener('mousedown', onClickOutsideChoice);
}

// deleting a topic
const deleting = ref(false);
const deletedMessage = ref(false);
const deleteTopic = async() => {
    deleting.value = true;
    document.removeEventListener('mousedown', onClickOutsideChoice);
    document.removeEventListener('click', onClickOutsideChoice2);
    deletePopup.value = false;
    const topicsRef = collection(db, "topics");
    const q = query(topicsRef, where("displayName", "==", storeEditQuiz.chosenTopic));
    try {
        const snapshot = await getDocs(q);
        const topicDoc = snapshot.docs[0];
        await deleteDoc(doc(db, "topics", topicDoc.id));
        deleting.value = false;
        deletedMessage.value = `Successfully deleted ${storeEditQuiz.chosenTopic}.`;
    } catch(error) {
        deletedMessage.value = `An error occurred and the topic was not deleted.\n${error}`;
        console.error(error);
    }
}
const close = () => {
    document.removeEventListener('click', onClickOutside2);
    deletePopup.value = false;
}

// cleaning up
onBeforeUnmount(() => {
    document.removeEventListener('mousedown', onClickOutside);
    document.removeEventListener('click', onClickOutside2);
    document.removeEventListener('mousedown', onClickOutsideChoice);
    document.removeEventListener('click', onClickOutsideChoice2);
    storeEditQuiz.editOrDelete = false;
    storeEditQuiz.chosenTopic = null;
    deleting.value = false;
    deletedMessage.value = false;
    activateEditError.value = false;
    activatingEdit.value = false;
})
</script>

<template>
    <PageTop>Choose a topic to edit or delete</PageTop>
    <Choice></Choice>

    <div v-if="storeEditQuiz.editOrDelete">
        <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80"></div>
        <div ref="dialog1" class="fixed w-[450px] px-4 h-auto pb-4 border border-brand border-4 bg-bgbtn rounded-3xl text-brand fixed left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
            <h1 class="text-xl text-wg text-center md:text-3xl mt-2">Do you want to edit or delete this topic?</h1>
            <div class="flex justify-between gap-x-8 mt-4 md:gap-x-16 md:mt-8 md:mx-4">
                <DarkBtn @click="handleEdit">Edit</DarkBtn>
                <DarkBtn @click="handleDelete" class="bg-red-900 border-0 hover:bg-red-300">Delete</DarkBtn>
            </div>
        </div>
    </div>

    <Popup ref="dialog2" v-if="deletePopup" @confirm="deleteTopic" @decline="close" custom-class1="bg-red-900 border-0 hover:bg-red-300">Are you sure you want to delete<br>{{ storeEditQuiz.chosenTopic }}</Popup>

    <div v-if="deleting || deletedMessage !== false">
        <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-95"></div>
        <CenterMessage v-if="deleting">Deleting {{ storeEditQuiz.chosenTopic }}...</CenterMessage>
        <CenterMessage v-if="deletedMessage !== false">{{ deletedMessage }}</CenterMessage>
        <RouterLink :to="{name: 'home'}"><DarkBtn class="fixed left-1/2 transform -translate-x-1/2 bottom-40">Ok</DarkBtn></RouterLink>
    </div>

    <div v-if="activatingEdit || activateEditError">
        <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-95"></div>
        <CenterMessage v-if="activatingEdit">Creating the edit form...</CenterMessage>
        <CenterMessage v-if="activateEditError">An error occurred.</CenterMessage>
        <RouterLink v-if="activateEditError" :to="{name: 'home'}"><DarkBtn class="fixed left-1/2 transform -translate-x-1/2 bottom-40">Ok</DarkBtn></RouterLink>
    </div>
</template>