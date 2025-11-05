import React from "react";

export default function DataTable({
  columns,
  data,
  emptyMessage = "No data available.",
}) {
  const styles = {
    container: {
      overflowX: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: "#fff",
      marginTop: "7px",
      borderRadius: "13px",
      fontSize: "15px",
      overflow: "hidden",
    },
    head: {
      background: "#e0f7f5",
      color: "#06786e",
      fontWeight: "600",
    },
    headCell: {
      padding: "11px 13px",
      border: "none",
      fontSize: "15px",
      textAlign: "left",
    },
    cell: {
      padding: "11px 13px",
      border: "none",
      fontSize: "15px",
      color: "#243747",
      borderBottom: "1px solid #e5e7eb",
    },
    row: (index) => ({
      background: index % 2 === 0 ? "#fff" : "#f9fafb",
    }),
    emptyCell: {
      textAlign: "center",
      padding: "28px",
      color: "#7a7a7a",
    },
  };

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.head}>
            {columns.map((column) => (
              <th key={column.key} style={styles.headCell}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={styles.emptyCell}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row.id} style={styles.row(index)}>
                {columns.map((column) => (
                  <td key={column.key} style={styles.cell}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
