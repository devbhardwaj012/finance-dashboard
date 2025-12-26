export default function TableWidget({ widget }) {
  return (
    <table className="w-full">
      <thead><tr>{widget.fields.map(f => <th key={f}>{f}</th>)}</tr></thead>
      <tbody><tr>{widget.fields.map(f => <td key={f}>—</td>)}</tr></tbody>
    </table>
  );
}