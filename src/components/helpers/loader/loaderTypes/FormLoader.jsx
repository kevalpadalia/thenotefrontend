import React from "react";
import { Box, Skeleton, Card, CardHeader, useTheme } from '@mui/material';
import { tokens } from "../../../../theme";

const FormLoader = (counter) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const cards = Array.from({ length: counter?counter:10 }, (_, index) => (
        <Card
            mb={2}
            key={index}
            sx={{ backgroundColor: colors.primary[500], marginTop: '5px' }}
            variant="outlined"
        >
            <CardHeader
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

export default FormLoader