// deletarItem.jsx
import Swal from "sweetalert2";

export function deletarItem({ onClose, onDelete, itemId, itemTipo }) {
  Swal.fire({
    title: `Excluir ${itemTipo}`,
    text: `Tem certeza que deseja deletar o ${itemTipo}${
      itemId ? ` com ID ${itemId}` : ""
    }?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, deletar!",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  }).then((result) => {
    if (result.isConfirmed) {
      onDelete?.(); // dispara ação de deletar
      Swal.fire("Excluído!", `${itemTipo} removido com sucesso.`, "success");
      onClose?.(); // fecha modal se existir
    }
  });
}
