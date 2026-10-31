import { createRoot } from "react-dom/client";
import { BurgerDemo } from "./BurgerDemo";
import "./base.css";
import "./burger-demo.css";

createRoot(document.getElementById("root")!).render(<BurgerDemo />);
