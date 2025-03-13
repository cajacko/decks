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
    return <CardAction icon={icon} onPress={action} active={isHighlighted} />;
  };
}
