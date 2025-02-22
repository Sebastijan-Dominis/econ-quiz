// imports
import { defineStore } from "pinia";
import { auth } from '../js/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../js/firebase";

export const useStoreAuth = defineStore('storeAuth', {
    state: () => {
        return {
            user: null,
            loading: false,
        }
    },
    actions: {
        async registerUser(credentials) {
            this.loading = true;

            try {
                // check if username already exists
                const usersRef = collection(db, 'users');
                const q1 = query(usersRef, where("username", "==", credentials.username));
                const querySnapshot1 = await getDocs(q1);
                const q2 = query(usersRef, where("email", "==", credentials.email));
                const querySnapshot2 = await getDocs(q2);

                if(!querySnapshot1.empty && !querySnapshot2.empty) {
                    alert("Username and email are already taken. Please choose another.");
                    return;
                }

                if(!querySnapshot1.empty) {
                    alert("Username is already taken. Please choose another.");
                    return;
                }

                if(!querySnapshot2.empty) {
                    alert("Email is already taken. Please choose another.");
                    return;
                }

                // Create user in Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
                const user = userCredential.user;

                // Store user info in Firestore
                const userRef = doc(db, 'users', user.uid);
                await setDoc(userRef, {
                    username: credentials.username,
                    email: credentials.email
                });

                this.user = user;
            } catch(error) {
                console.error("Error during user registration: ", error);
                alert("An error occured during registration. Please try again.");
            } finally {
                this.loading = false;
            }
        },
        async loginUser(credentials) {
            this.loading = true;

            try {
                let email = credentials.identifier;

                // managing sing in with username
                if(!email.includes('@')) {
                    const usersRef = collection(db, 'users');
                    const q1 = query(usersRef, where("username", "==", email));
                    const querySnapshot1 = await getDocs(q1);

                    if(querySnapshot1.empty) {
                        throw new Error(`User with username ${email} not found.`);
                    }

                    email = querySnapshot1.docs[0].data().email;
                } else {
                    const q2 = query(userRef, where("email", "==", email));
                    const querySnapshot2 = await getDocs(q2);

                    if(querySnapshot2.empty) {
                        throw new Error(`User with email ${email} not found.`);
                    }
                }

                // signing in with email
                const userCredential = await signInWithEmailAndPassword(auth, email, credentials.password);
                this.user = userCredential.user;
            } catch(error) {
                console.error("Error during login: ", error);
            } finally {
                this.loading = false;
            }
        },
        async logoutUser() {
            this.loading = true;
            
            try {
                await signOut(auth);
                this.user = null;
            } catch (error) {
                console.error("Error while logging out: ", error);
            } finally {
                this.loading = false;
            }
        }
    }
})