import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { createAPIEndPoint } from "../../../../config/api/api";
import Loader from "../../../../components/loader";
import ErrorMessage from "../../../../components/error-message";
import { saveAs } from "file-saver";

const PreAuthFiles = ({ id }) => {
  const [preauthFiles, setPreauthFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPreauthFiles = async () => {
    try {
      setLoading(true);
      const response = await createAPIEndPoint(
        "pre_auth_request/file/"
      ).fetchById(id);
      setLoading(false);
      setPreauthFiles(response.data.files || []);
    } catch (error) {
      setLoading(false);
      console.log(error?.response?.data?.error || "Error fetching files");
    }
  };

  useEffect(() => {
    getPreauthFiles();
  }, [id]);

  const handleView = (filePath) => {
    window.open(filePath, "_blank");
  };

  // const handleDownload = (filePath, fileName) => {
  //   const link = document.createElement("a");
  //   link.href = filePath;
  //   link.download = fileName;
  //   link.click();
  // };

  const handleDownload = () => {
    let url =
      "https://help.twitter.com/content/dam/help-twitter/brand/logo.png";
    saveAs(url, "Twitter-logo");
  };

  return (
    <CardContent>
      <Typography variant="h6" color="secondary" gutterBottom>
        Preauth Files
      </Typography>

      <Box sx={{ overflowX: "auto" }}>
        <TableContainer sx={{ maxHeight: "45vh" }}>
          <Table stickyHeader aria-label="pre auth files">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    // backgroundColor: "#FAFAFA",
                    borderBottom: "1px solid #E4E4E7",
                    color: "#71717A",
                  }}
                >
                  File Name
                </TableCell>
                <TableCell
                  sx={{
                    // backgroundColor: "#FAFAFA",
                    borderBottom: "1px solid #E4E4E7",
                    color: "#71717A",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell sx={{ py: 3 }} colSpan={9} align="center">
                    <Loader />
                  </TableCell>
                </TableRow>
              ) : preauthFiles.length === 0 ? (
                <ErrorMessage source="pre auths files" span={6} />
              ) : (
                <>
                  {preauthFiles &&
                    preauthFiles?.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {file.file_name.split(".").slice(0, -1).join(".")}
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleView(file.file_path)}
                            className="mr-2 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium h-9 rounded-md px-3 border border-[#e4e4e7] hover:bg-[#f4f4f5] transition-all"
                          >
                            View
                          </button>

                          <button
                            onClick={() =>
                              handleDownload(file.file_path, file.file_name)
                            }
                            className="mr-2 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium h-9 rounded-md px-3 border border-[#e4e4e7] hover:bg-[#f4f4f5] transition-all"
                          >
                            Download
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </CardContent>
  );
};

export default PreAuthFiles;
