interface Props {
  sku: String;
}

export const ProductSizeChart = ({ sku }: Props) => {
  return (
    <table className="table-auto border">
      <thead>
        <tr>
          <th className="border text-gray-500 font-normal p-2">Size</th>
          <th className="border text-gray-500 font-normal p-2">Width (A)</th>
          <th className="border text-gray-500 font-normal p-2">Length (B)</th>
          <th className="border text-gray-500 font-normal p-2">Sleeve Center Back (D2)</th>
          <th className="border text-gray-500 font-normal p-2">Per Pack</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  );
};
