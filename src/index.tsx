import { Dashboard } from "@ui";
import { render } from "ink";
import React from "react";
import { Provider } from "src/ui/Provider";

render(
	<Provider>
		<Dashboard />
	</Provider>,
);
