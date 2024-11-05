import React from "react";
import { Box, Skeleton, Card, CardHeader, useTheme } from '@mui/material';
import { tokens } from "../../../../theme";

const ListLoader = (counter) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const cards = Array.from({ length: counter?counter:10 }, (_, index) => (
        <Card
            key={index}
            sx={{ backgroundColor: colors.primary[500], marginTop: '5px' }}
            variant="outlined"
        >
            <CardHeader
                avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
                title={
                    <Skeleton
                        animation="wave"
                        height={10}
                        width="80%"
                        style={{ marginBottom: 6 }}
                    />
                }
                subheader={<Skeleton animation="wave" height={10} />}
            />
        </Card>
    ));
    return <div>{cards}</div>;
}

export default ListLoader