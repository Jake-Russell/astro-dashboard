import { AstronomyProvider } from "./components/contexts/AstronomyContext";
import { AstroDashboard } from "organisms/AstroDashboard";

const Page = () => {
    return (
        <AstronomyProvider>
            <AstroDashboard />
        </AstronomyProvider>
    );
};

export default Page;
