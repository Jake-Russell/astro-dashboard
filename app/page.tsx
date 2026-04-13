import { ThemeProvider } from "contexts/ThemeContext";
import { AstronomyProvider } from "./components/contexts/AstronomyContext";
import { AstroDashboard } from "organisms/AstroDashboard";

const Page = () => {
    return (
        <ThemeProvider>
            <AstronomyProvider>
                <AstroDashboard />
            </AstronomyProvider>
        </ThemeProvider>
    );
};

export default Page;
