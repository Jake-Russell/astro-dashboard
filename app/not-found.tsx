import type { Metadata } from "next";
import { NotFoundContent } from "molecules";

export const metadata: Metadata = {
    title: "Lost in Space",
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return <NotFoundContent />;
}
