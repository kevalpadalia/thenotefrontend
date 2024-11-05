import { Box,useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";

const TableTemplate = ({ rows, columns,uniqueId }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Box >
            <Box
                height="100%"
                maxWidth="100%"
                overflow="auto"
                sx={{
                    border: "2px solid" + colors.grey[theme.palette.mode == 'dark' ? 700 : 900],
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderRight: "1px solid" + colors.grey[theme.palette.mode == 'dark' ? 700 : 900],
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'center',
                    },
                    "& .name-column--cell": {
                        color: colors.primaryhighlight[300],
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'center',
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.secondary[500],
                        borderBottom: "none",
                        color:  colors.grey[100],
                        fontWeight: 'bold',
                        // display: 'flex',
                        // justifyContent: 'end',
                        // alignItems: 'center',
                    },
                    "& .MuiDataGrid-columnHeader, & .MuiDataGrid-columnHeaderWrapper": {
                        borderRight: "1px solid" + colors.grey[theme.palette.mode == 'dark' ? 700 : 900],
                        borderBottom: "2px solid" + colors.grey[theme.palette.mode == 'dark' ? 700 : 900],
                        borderTop: "2px solid" + colors.grey[theme.palette.mode == 'dark' ? 700 : 900],
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[500],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        backgroundColor: colors.primary[500],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.primaryhighlight[200]} !important`,
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.grey[100]} !important`,
                    },
                }}
            >
                <DataGrid components={{ Toolbar: GridToolbar }} getRowId={(row) => row[uniqueId]} rows={rows} columns={columns} density="compact"
                    // onCellClick={(params) => {
                    //     if (!(params.field === 'disable' || params.field === 'action')) {

                    //         handEdit(params);
                    //     }
                    // }}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 20 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 20]}
                />
            </Box>
        </Box>
    );
}

export default TableTemplate;