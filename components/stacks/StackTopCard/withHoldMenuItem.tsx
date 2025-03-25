import { MenuItemComponentProps } from "@/components/ui/HoldMenu";
import { IconSymbolName } from "@/components/ui/IconSymbol";
import CardAction from "@/components/forms/CardAction";

export default function withHoldMenuItem(
  icon: IconSymbolName,
  action?: () => void,
) {
  return function HoldMenuItem({
    isHighlighted,
  }: MenuItemComponentProps): React.ReactNode {
    // DO not pass the action in here as the hold menu covers it
    return <CardAction icon={icon} active={isHighlighted} />;
  };
}
