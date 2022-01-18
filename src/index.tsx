import { Dashboard } from "@ui";
import { config } from "dotenv";
import { render } from "ink";
import React from "react";
import { Provider } from "src/ui/Provider";

config();
render(
	<Provider>
		<Dashboard />
	</Provider>,
	{ debug: true },
);
