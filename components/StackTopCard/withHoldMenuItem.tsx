import { MenuItemComponentProps } from "../HoldMenu";
import { IconSymbolName } from "../IconSymbol";
import CardAction from "../CardAction";

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
