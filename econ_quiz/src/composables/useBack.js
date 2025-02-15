import { useRouter } from "vue-router";

export function useBack() {
    const router = useRouter();
    
    const back = () => {
        router.back();
    }

    return {back};
}