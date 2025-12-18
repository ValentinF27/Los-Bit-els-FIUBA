import { borrarReseña } from "./api.js";

// Función para eliminar una reseña.
export async function eliminarReseña(reseña_id) {
  try {
    // Confirma antes de eliminar.
    const confirmar = confirm("¿Estás seguro de que quieres eliminar esta reseña?");
    if (!confirmar) return;

    // Elimina la reseña desde el backend.
    const exito = await borrarReseña(reseña_id);
    if (!exito) {
      alert("Hubo un problema al eliminar la reseña.");
      return;
    }

    // Actualiza la UI: remover la reseña del DOM.
    const reseñaElement = document.querySelector(`.review-post[data-id='${reseña_id}']`);
    if (reseñaElement) {
      reseñaElement.remove();
    }
    alert("Reseña eliminada correctamente");

  } catch (error) {
    console.error("Error al eliminar la reseña:", error);
    alert("Error al eliminar la reseña.");
  }
}

