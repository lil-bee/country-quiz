import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import "../src/theme/style.css";
function App() {
	return (
		<>
			<ChakraProvider theme={theme}>
				<div>Test</div>
			</ChakraProvider>
		</>
	);
}

export default App;
