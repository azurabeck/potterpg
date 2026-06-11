import { useMemo, useState } from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../../../../services/firebase";
import Modal from "../../../../../components/Modal";
import RulesPanel from "../../Shared/RulesPanel";
import Side from "./Side";
import Table from "./Table";
import ItemFormModal from "./ItemFormModal";
import ItemDetailsModal from "./ItemDetailsModal";
import inventoryRules from "./json-files/inventoryRules.json";
import {
   createInventoryItem,
   filterItems,
   getCharacterInventory,
   removeItem,
   upsertItem,
} from "./helpers";

const InventoryTab = ({ selectedCharacter, setCharacters }) => {
   const inventory = useMemo(() => getCharacterInventory(selectedCharacter), [selectedCharacter]);
   const [search, setSearch] = useState("");
   const [categoryFilter, setCategoryFilter] = useState("");
   const [moneyDraft, setMoneyDraft] = useState(() => ({
      nuquens: String(inventory?.nuquens || 0),
      sicles: String(inventory?.sicles || 0),
      goldens: String(inventory?.goldens || 0),
   }));
   const [modal, setModal] = useState(null);
   const [isSaving, setIsSaving] = useState(false);

   const filteredItems = useMemo(() => {
      return filterItems({ items: inventory.itens, search, category: categoryFilter });
   }, [inventory.itens, search, categoryFilter]);

   const updateLocalInventory = (nextInventory) => {
      setCharacters((currentCharacters) =>
         currentCharacters.map((character) =>
            character.id === selectedCharacter.id ? { ...character, inventario: nextInventory } : character
         )
      );
   };

   const saveInventory = async (nextInventory) => {
      if (!selectedCharacter?.id) return;

      setIsSaving(true);

      try {
         await updateDoc(doc(db, "characters", selectedCharacter.id), {
            inventario: nextInventory,
            updated_at: serverTimestamp(),
         });

         updateLocalInventory(nextInventory);
      } catch (error) {
         console.error("Erro ao salvar inventário:", error);
      } finally {
         setIsSaving(false);
      }
   };

   const handleSaveMoney = () => {
      saveInventory({
         ...inventory,
         nuquens: Number(moneyDraft.nuquens || 0),
         sicles: Number(moneyDraft.sicles || 0),
         goldens: Number(moneyDraft.goldens || 0),
      });
   };

   const handleSaveItem = (form) => {
      const item = createInventoryItem(form);
      const nextInventory = { ...inventory, itens: upsertItem(inventory.itens, item) };

      saveInventory(nextInventory);
      setModal(null);
   };

   const handleDeleteItem = (itemId) => {
      const nextInventory = { ...inventory, itens: removeItem(inventory.itens, itemId) };
      saveInventory(nextInventory);
   };

   const openAddItemModal = () => {
      setModal({ type: "form", title: "Adicionar Item", item: null });
   };

   const openItemDetailsModal = (item) => {
      setModal({ type: "details", title: item.nome || "Detalhes do Item", item });
   };

   const openEditItemModal = (item) => {
      setModal({ type: "form", title: "Editar Item", item });
   };

   return (
   <div className="grid grid-cols-[1.3fr_1fr] gap-12 pb-2">
      <Modal isOpen={!!modal} title={modal?.title} onClose={() => setModal(null)}>
         {modal?.type === "form" ? <ItemFormModal key={modal.item?.id || "new-item"} item={modal.item} onSubmit={handleSaveItem}/> : null}
         {modal?.type === "details" ? <ItemDetailsModal item={modal.item} onEdit={openEditItemModal} /> : null}
         {modal?.type === "rules" ? <RulesPanel activeTab="inventory" currentRules={inventoryRules} /> : null}
      </Modal>

      <Table
         items={filteredItems}
         onOpenItem={openItemDetailsModal}
         onDeleteItem={handleDeleteItem}
         isSaving={isSaving}
      />

      <Side
         search={search}
         categoryFilter={categoryFilter}
         inventory={inventory}
         moneyDraft={moneyDraft}
         setSearch={setSearch}
         setCategoryFilter={setCategoryFilter}
         setMoneyDraft={setMoneyDraft}
         onAddItem={openAddItemModal}
         onOpenRules={() => setModal({ type: "rules", title: "Regras do Inventário" })}
         onSaveMoney={handleSaveMoney}
         isSaving={isSaving}
      />
   </div>
);
};

export default InventoryTab;
