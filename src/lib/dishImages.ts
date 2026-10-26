import heroBiryani from "@/assets/hero-biryani.jpg";
import bbq from "@/assets/bbq.jpg";
import breakfast from "@/assets/breakfast.jpg";
import burger from "@/assets/burger.jpg";
import salad from "@/assets/salad.jpg";
import lemonade from "@/assets/lemonade.jpg";
import coldDrink from "@/assets/cold-drink.jpg";
import chai from "@/assets/chai.jpg";

// Category photo for every menu dish. The photo is the dish's category photo
// (for example, every BBQ dish uses the BBQ photo), so every dish card has a
// high-quality image in the same card style. Replace a mapping here with a
// real photo of that exact dish whenever one becomes available.
export function dishImageFor(subcategory: string | null, category: string): string {
  switch (subcategory) {
    case "Desi & Rice":
      return heroBiryani;
    case "Breakfast":
      return breakfast;
    case "BBQ":
      return bbq;
    case "Fast Food":
      return burger;
    case "Sides":
      return salad;
    case "Refreshers":
      return lemonade;
    case "Soft Drinks":
      return coldDrink;
    case "Hot":
      return chai;
    default:
      return category === "beverages" ? lemonade : heroBiryani;
  }
}
