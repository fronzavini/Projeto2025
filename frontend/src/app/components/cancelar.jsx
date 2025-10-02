// cancelar.jsx
import Swal from "sweetalert2";

export function cancelar({
  title,
  message,
  itemId,
  confirmLabel = "Confirmar",
  confirmColor = "#e53935",
  cancelLabel = "Cancelar",
  onConfirm,
}) {
  // Se itemId estiver presente, adiciona ao final da mensagem
  const textoFinal = itemId ? `${message} #${itemId}` : message;

  Swal.fire({
    title,
    text: textoFinal,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmLabel,
    cancelButtonText: cancelLabel,
    confirmButtonColor: confirmColor,
    cancelButtonColor: "#3085d6",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      Swal.fire("Pronto!", "Ação realizada com sucesso.", "success");
    }
  });
}