import { Dashboard } from "@ui";
import { render } from "ink";
import React from "react";

import { Client } from "@lib";

const client = new Client();

render(<Dashboard client={client} />);
