import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export interface CurriculumEntry {
    sectionId: string;
    topicId: string;
    materialId: string;
    subject: string;
}

// Flattens the published curriculum (Sections -> Topics -> Materials, in
// SortOrder) into one ordered list, so the material detail view can offer a
// continuous "Previous / Next" path through the whole course instead of
// dead-ending back at a list after every lesson. Loaded once and cached for
// the session - the curriculum is small and changes rarely.
export const useMaxiUniversityStore = defineStore('maxiUniversityStore', () => {
    const flatList = ref<CurriculumEntry[]>([]);
    const loaded = ref(false);
    const loading = ref(false);

    const ensureLoaded = async () => {
        if (loaded.value || loading.value) return;
        loading.value = true;
        try {
            const sectionsRes = await axios.get('MaxiUniversity/Agent/Sections');
            const sections = sectionsRes.data ?? [];

            const topicsPerSection = await Promise.all(
                sections.map((s: any) =>
                    axios.get(`MaxiUniversity/Agent/Sections/${s.id}/Topics`).then((r) => r.data ?? [])
                )
            );

            const topicRefs: { sectionId: string; topic: any }[] = [];
            sections.forEach((section: any, i: number) => {
                topicsPerSection[i].forEach((topic: any) => topicRefs.push({ sectionId: section.id, topic }));
            });

            const materialsPerTopic = await Promise.all(
                topicRefs.map(({ topic }) =>
                    axios.get(`MaxiUniversity/Agent/Topics/${topic.id}/Materials`).then((r) => r.data ?? [])
                )
            );

            const flat: CurriculumEntry[] = [];
            topicRefs.forEach(({ sectionId, topic }, i) => {
                materialsPerTopic[i].forEach((material: any) => {
                    flat.push({ sectionId, topicId: topic.id, materialId: material.id, subject: material.subject });
                });
            });

            flatList.value = flat;
            loaded.value = true;
        } catch {
            // Previous/Next is a convenience, not a hard requirement - if it fails to
            // load, the buttons simply won't render rather than breaking the page.
        } finally {
            loading.value = false;
        }
    };

    const getAdjacent = (materialId: string): { prev: CurriculumEntry | null; next: CurriculumEntry | null } => {
        const idx = flatList.value.findIndex((x) => x.materialId === materialId);
        if (idx === -1) return { prev: null, next: null };
        return {
            prev: idx > 0 ? flatList.value[idx - 1] : null,
            next: idx < flatList.value.length - 1 ? flatList.value[idx + 1] : null,
        };
    };

    return { flatList, loaded, loading, ensureLoaded, getAdjacent };
});
