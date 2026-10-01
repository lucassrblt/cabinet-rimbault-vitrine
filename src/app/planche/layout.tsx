import {
  Instrument_Sans,
  Libre_Caslon_Text,
  Public_Sans,
  Source_Serif_4,
} from "next/font/google";
import "./planche.css";

const caslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-caslon",
});
const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public",
});
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-source",
});
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

export const metadata = { title: "Planche de style" };

export default function PlancheLayout({ children }: LayoutProps<"/planche">) {
  return (
    <div
      className={`pl ${caslon.variable} ${publicSans.variable} ${sourceSerif.variable} ${instrument.variable}`}
    >
      {children}
    </div>
  );
}
