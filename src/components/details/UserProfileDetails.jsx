import { Fragment,useState } from "react";
import { useSelector } from "react-redux";
import { Box,Grid,Typography, useTheme } from "@mui/material";
import { UserCircle,IdentificationCard,User,Phone,EnvelopeSimple} from "@phosphor-icons/react";
import { tokens } from "../../theme";
import Loader from "../helpers/loader/Loader";

const UserProfileDetails = () => {
    // STANDARDS
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // STATE
    const userDetails = useSelector((state) => {
        return state && state.user && state.user.user ? state.user.user : {}
    })
    // VARIABLES
    const [isLoading, setIsLoading] = useState(false);
    // METHODS
    // WATEHER
    // TEMPLATES
    return (
        <Fragment>
            {isLoading?(
                <Loader/>
            ):(
            <>
            <Box mx={1} mb={1} pt={1} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                <Typography display="flex" alignItems="center"  variant="h5" color={colors.grey[100]}>
                    {/* <UserCircle style={{ marginRight:"10px"}} size={iconHelper.size} weight={iconHelper.dualtone} /> */}
                    <UserCircle size={20} weight="duotone" style={{marginRight:"10px"}}/>Profile
                </Typography>
            </Box>
                        <Box mt={1} mx={1}>
                            {userDetails && userDetails._id &&
                                <Grid container
                                    sx={{
                                        backgroundColor: colors.secondary[500],
                                        borderRadius: "5px",
                                        borderTop: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                        borderLeft: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                        overflow: 'hidden',
                                        position: 'relative',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        sx={{
                                            padding: "10px",
                                            borderRight: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                            borderBottom: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            color={colors.grey[100]}
                                            display='flex'
                                            alignItems='center'
                                            sx={{ paddingBottom: "5px" }}
                                        >
                                            <IdentificationCard style={{ marginRight: "10px" }} size={20} weight="duotone" />
                                            ID
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            color={colors.grey[100]}
                                            fontWeight="bold"
                                        >
                                            {userDetails._id}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        sx={{
                                            padding: "10px",
                                            borderRight: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                            borderBottom: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            color={colors.grey[100]}
                                            display='flex'
                                            alignItems='center'
                                            sx={{ paddingBottom: "5px" }}
                                        >
                                            <User style={{ marginRight: "10px" }} size={20} weight="duotone" />
                                            Name
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            color={colors.grey[100]}
                                            fontWeight="bold"
                                        >
                                            {userDetails.name}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        sx={{
                                            padding: "10px",
                                            borderRight: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                            borderBottom: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            color={colors.grey[100]}
                                            display='flex'
                                            alignItems='center'
                                            sx={{ paddingBottom: "5px" }}
                                        >
                                            <Phone style={{ marginRight: "10px" }} size={20} weight="duotone" />
                                            Phone No
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            color={colors.grey[100]}
                                            fontWeight="bold"
                                        >
                                            {userDetails.phone ? userDetails.phone : '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        sx={{
                                            padding: "10px",
                                            borderRight: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                            borderBottom: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            color={colors.grey[100]}
                                            display='flex'
                                            alignItems='center'
                                            sx={{ paddingBottom: "5px" }}
                                        >
                                            <EnvelopeSimple style={{ marginRight: "10px" }} size={20} weight="duotone" />
                                            Email
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            color={colors.grey[100]}
                                            fontWeight="bold"
                                        >
                                            {userDetails.email ? userDetails.email : '-'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                }
            </Box>
            </>
            )
        }
        </Fragment>
    )
}

export default UserProfileDetails;