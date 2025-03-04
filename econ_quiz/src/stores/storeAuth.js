// imports
import { defineStore } from "pinia";
import { auth, db, googleProvider } from '../js/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, deleteUser, onAuthStateChanged, linkWithPopup, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDocs, collection, query, where, getDoc } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth/web-extension";

export const useStoreAuth = defineStore('storeAuth', {
    state: () => {
        return {
            user: null,
            loading: false,
            isLoggedIn: false,
            isAdmin: false,
            logoutq: false
        }
    },
    actions: {
        init() {
            onAuthStateChanged(auth, user => {
                if(user) {
                    this.isLoggedIn = true;
                    this.isAdmin = true;
                    this.user = user;
                    this.router.push('/');
                } else {
                    this.isLoggedIn = false;
                    this.isAdmin = false;
                    this.user = null;
                    this.router.replace('/');
                }
            })
        },
        async registerUser(credentials) {
            this.loading = true;
            let user = null;

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
                user = userCredential.user;

                // Manually set the username
                await updateProfile(user, {
                    displayName: credentials.username
                })

                // Store user info in Firestore
                const userRef = doc(db, 'users', user.uid);
                await setDoc(userRef, {
                    username: credentials.username,
                    email: credentials.email,
                    isAdmin: false
                });
            } catch(error) {
                console.error("Error during user registration: ", error);
                alert("An error occured during registration. Please try again.");

                if(user) {
                    try {
                        await deleteUser(user);
                        console.log("Orphaned user deleted from firebase.");
                    } catch {
                        console.log("Failed to delete orphaned user with id: ", user.uid);
                    }
                }
            } finally {
                this.loading = false;
            }
        },
        async loginUser(credentials) {
            this.loading = true;

            try {
                let email = credentials.identifier;
                // managing sign in with username
                const usersRef = collection(db, 'users');
                if(!email.includes('@')) {
                    const q1 = query(usersRef, where("username", "==", email));
                    const querySnapshot1 = await getDocs(q1);

                    if(querySnapshot1.empty) {
                        alert(`User with username ${email} not found.`);
                        return;
                    }

                    email = querySnapshot1.docs[0].data().email;
                } else {
                    const q2 = query(usersRef, where("email", "==", email));
                    const querySnapshot2 = await getDocs(q2);

                    if(querySnapshot2.empty) {
                        alert(`User with email ${email} not found.`);
                        return;
                    }
                }

                // signing in
                await signInWithEmailAndPassword(auth, email, credentials.password);
            } catch(error) { 
                if(error.code === "auth/invalid-credential") {
                    alert("Incorrect password. Please try again.");
                } else {
                    alert("An unexpected error occurred. Please try again.");
                }
            } finally {
                this.loading = false;
            }
        },
        async logoutUser() {
            this.loading = true;
            try {
                await signOut(auth);
            } catch (error) {
                alert("Something went wrong. Try again.");
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
        async signInWithGoogle() {
            try {
                auth.useDeviceLanguage();
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("email", "==", user.email));
                const snapshot = await getDocs(q);
                
                if(!snapshot.empty) {
                    const firestoreUsername = snapshot.docs[0].data().username;
                    if(firestoreUsername && firestoreUsername !== user.displayName) {
                        await updateProfile(user, {
                            displayName: firestoreUsername
                        })
                    }
                }
            } catch(error) {
                console.error(error);
            }
        }
    }
})