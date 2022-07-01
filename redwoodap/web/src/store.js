import create from 'zustand';

const useStore = create((set) => ({
    spaces: [],
    addSpace: (space) => set((state) => ({ spaces: [...state.spaces, space] })),
    setSpaces: (spaces) => set((state) => ({ spaces }))
}));

export default useStore;