import React from "react";
import { TableCell, TableRow } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const ErrorMessage = ({ span = 8, source = "data", extra = "" }) => {
  return (
    <TableRow>
      <TableCell sx={{ py: 3 }} colSpan={span} align="center">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <SentimentDissatisfiedIcon
            style={{ fontSize: 32, color: "#a9a9aa" }}
          />
          <span style={{ color: "#a9a9aa" }}>
            No {source} found {extra}
          </span>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ErrorMessage;
