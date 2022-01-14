import { useContext } from "react";
import ClientContext from "src/ui/Provider";

import { Client } from "@lib";

export const useClient = (): Client => useContext(ClientContext)!;
