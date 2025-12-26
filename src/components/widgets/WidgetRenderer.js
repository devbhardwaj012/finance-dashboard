import CardWidget from "./CardWidget";
import TableWidget from "./TableWidget";
import ChartWidget from "./ChartWidget";

export default function WidgetRenderer({ widget }) {
  if (widget.type === "table") return <TableWidget widget={widget} />;
  if (widget.type === "chart") return <ChartWidget widget={widget} />;
  return <CardWidget widget={widget} />;
}