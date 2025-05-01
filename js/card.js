document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".event-one-card");
  
    cards.forEach(card => {
      const link = card.getAttribute("data-link");

      card.addEventListener("click", () => {
        window.location.href = link;
      });
  
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          window.location.href = link;
        }
      });
    });
  });
  