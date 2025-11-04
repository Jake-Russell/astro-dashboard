import { render, screen } from "@testing-library/react";
import Tile from "../Tile";

describe("Tile component", () => {
    beforeEach(() => {
        render(<Tile title="Test Tile">Hello world</Tile>);
    });

    it("renders the title correctly", () => {
        expect(screen.getByText("Test Tile")).toBeInTheDocument();
    });

    it("renders children content", () => {
        expect(screen.getByText("Hello world")).toBeInTheDocument();
    });
});
