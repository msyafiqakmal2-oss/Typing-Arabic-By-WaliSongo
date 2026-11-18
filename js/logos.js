/* Memuat logo dari alamat di LOGOS (js/materi.js). Bila file belum ada, tulisan sementara tetap tampil. */
function initLogos(root){
  (root || document).querySelectorAll(".logo-slot[data-logo]").forEach(slot=>{
    const src = (typeof LOGOS !== "undefined" && LOGOS[slot.dataset.logo]) || "";
    const img = slot.querySelector("img"), fb = slot.querySelector(".logo-fb");
    if (!img || !src) return;
    img.onload  = ()=>{ img.hidden = false; if (fb) fb.hidden = true; };
    img.onerror = ()=>{ img.hidden = true;  if (fb) fb.hidden = false; };
    img.src = src;
  });
}
document.addEventListener("DOMContentLoaded", ()=>initLogos());
