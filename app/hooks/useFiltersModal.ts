import { create } from 'zustand';

interface FiltersModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useFiltersModal = create<FiltersModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useFiltersModal;
