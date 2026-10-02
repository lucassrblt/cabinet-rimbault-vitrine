import { DirectionSwitcher } from "@/components/directions/DirectionSwitcher";
import { Motion } from "@/components/site/Motion";

export default function DirectionsLayout({
  children,
}: LayoutProps<"/directions">) {
  return (
    <>
      {children}
      <Motion />
      <DirectionSwitcher />
    </>
  );
}
