import { createContext } from "use-context-selector";
import * as Types from "./EditCard.types";

export default createContext<Types.EditCardContext | null>(null);
