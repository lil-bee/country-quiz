import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import "../src/theme/style.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Question from "./routes/question";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <div>Test</div>
          <Question />
        </ChakraProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
