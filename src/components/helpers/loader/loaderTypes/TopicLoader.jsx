import { React, Fragment } from "react";
import { Box, Skeleton, Card, CardHeader, CardContent, useTheme } from '@mui/material';
import { tokens } from "../../../../theme";

const TopicLoader = (counter) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const cards = Array.from({ length: counter?counter:3 }, (_, index) => (
        <Card key={index} sx={{ backgroundColor: colors.primary[500], marginTop: "10px" }} variant="outlined">
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
            <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
            <CardContent>
                <Fragment>
                    <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                    <Skeleton animation="wave" height={10} />
                </Fragment>
            </CardContent>
        </Card>
    ));
    return <Box>{cards}</Box>;
}

export default TopicLoader