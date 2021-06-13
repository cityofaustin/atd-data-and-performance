import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import BsTable from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

export default function Table({ features, headers, onRowClick }) {
  const [keys, setKeys] = React.useState(null);

  if (!features || features.length === 0) {
    return null;
  }

  return (
    <BsTable responsive hover striped size="sm" style={{fontSize: ".75em"}}>
      <thead>
        <tr>
          {headers.map((header, i) => {
            return (
              <th key={i}>
                {header.label}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {features.map((feature, i) => {
          return (
            <tr
              key={i}
              style={{ cursor: "pointer" }}
              onClick={() => {
                onRowClick(feature);
              }}
            >
              {headers.map(({ key }, x) => {
                return (
                  <td key={x}>
                    {feature.properties[key]}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </BsTable>
  );
}
