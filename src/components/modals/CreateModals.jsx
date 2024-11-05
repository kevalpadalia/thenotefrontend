import { Fragment, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Typography, useTheme, Button} from "@mui/material";
import { tokens } from "../../theme";

const CreateModals = ({buttonText, navigateTo}) => {
    // STANDARDS
    let navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    // STATE
    // VARIABLES
    // METHODS
    // WATHCERS
    // TEMPLATES
    return (
        <Fragment>
            <Button  size="small" color={theme.palette.mode === "dark"?"primaryhighlight2":"primaryhighlight2"} variant="contained" disableElevation>
                <Typography
                    onClick={()=>navigate(navigateTo)}
                    variant="caption"
                    fontSize="12px"
                    fontWeight="bold"
                    color={colors.grey[theme.palette.mode==='dark' ? 100:900]}
                >
                  {buttonText}
              </Typography>
                
            </Button>
        </Fragment >
    )
}

export default CreateModals;