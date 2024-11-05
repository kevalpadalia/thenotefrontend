import React, { Fragment } from "react";
import { Box, useTheme } from '@mui/material';
import "./Loader.css";
import { tokens } from "../../../theme";
import ListLoader from "./loaderTypes/ListLoader";
import TopicLoader from "./loaderTypes/TopicLoader";
import FormLoader from "./loaderTypes/FormLoader";
import TableLoader from "./loaderTypes/TableLoader";

const Loader = ({ loaderTypes = [], counter = 1 }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Mapping loader types to their corresponding components
    const loaderComponents = {
        formLoader: <FormLoader counter={counter} />,
        topicLoader: <TopicLoader counter={counter} />,
        listLoader: <ListLoader counter={counter} />,
        tableLoader: <TableLoader counter={counter} />,
        defaultLoader: Array.from({ length: counter }, (_, index) => (
            <div key={index} className="loader-container">
                <div className="body">
                    <span className="loader"></span>
                </div>
            </div>
        )),
    };

    return (
        <Fragment>
            {
                loaderTypes.length > 0 ? (
                    <Box>
                        {loaderTypes.map((type, index) => (
                            <Fragment key={index}>
                                {loaderComponents[type] || loaderComponents.defaultLoader}
                            </Fragment>
                        ))}
                    </Box>
                ) : (
                    loaderComponents["defaultLoader"]
                )
            }
        </Fragment>
    );
};

export default Loader;
