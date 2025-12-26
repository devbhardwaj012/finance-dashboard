import { Line } from "react-chartjs-2";

export default function ChartWidget({ widget }) {
  return (
    <Line data={{ labels: [1,2,3], datasets: [{ data: [1,2,3] }] }} />
  );
}