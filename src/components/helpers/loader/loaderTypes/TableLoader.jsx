import React from "react";
import { Box, Skeleton, useTheme } from '@mui/material';
import { tokens } from "../../../../theme";

const TableLoader = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const tableHeader = Array.from({ length: 5 }, (_, index) => (
        <Box key={index} sx={{ width: `${100 / 5}%`, padding: 10 }}>
            <Skeleton animation="wave" variant="rectangular"  height={30} width="80%" />
        </Box>
    ));

    const tableRows = Array.from({ length: 10 }, (_, rowIndex) => (
        <Box
            key={rowIndex}
            sx={{
                display: 'flex',
                width: '100%',
                backgroundColor: rowIndex % 2 === 0 ? colors.primary[400] : colors.primary[500],
                padding: 1,
                marginTop: 1,
            }}
        >
            {Array.from({ length: 5 }, (_, colIndex) => (
                <Box key={colIndex} sx={{ width: `${100 / 5}%`, padding: 10 }}>
                    <Skeleton animation="wave" height={25} variant="rectangular" />
                </Box>
            ))}
        </Box>
    ));

    return (
        <Box sx={{ width: '100%', backgroundColor: colors.primary[500] }}>
            <Box sx={{ display: 'flex', backgroundColor: colors.primary[600], padding: 10 }}>
                {tableHeader}
            </Box>
            {tableRows}
        </Box>
    );
};

export default TableLoader;
