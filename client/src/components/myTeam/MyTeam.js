//#region Import components
// React components
import React, { useState } from "react";
import PropTypes from "prop-types";

// Material UI components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

// Child components
import TeamInfo from "./TeamInfo";
import ProficiencyApprovalRequests from "./ProficiencyApprovalRequests";
import CustomSkillsGapAnalysis from "./CustomSkillsGapAnalysis";
import UpdateIdealProficiency from "./UpdateIdealProficiency";
//#endregion

//#region Tab Panel properties
// Template for Tab contents
function TabPanel(props) {
  // Constants initialization
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// Tab Panel properties
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}
//#endregion

// Styling definition for the Grid container
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: "1 !important",
    width: "100% !important",
  },
  appBar: {
    width: "auto !important",
  },
  tab: {
    [theme.breakpoints.down("xs")]: {
      maxWidth: "100 !important",
      width: "100% !important",
    },
    [theme.breakpoints.up("xs")]: {
      margin: "auto !important",
    },
  },
}));

function MyTeam(props) {
  // Constants initialization
  const [value, setValue] = useState(0);
  const classes = useStyles();
  const { profile, tmPosition } = props;

  // Cusom handle change function
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return profile &&
    (tmPosition === "lead" ||
      tmPosition === "manager" ||
      tmPosition === "admin") ? (
    <Grid
      container
      align="center"
      justifyContent="center"
      className={classes.root}
      spacing={1}
      style={{ marginTop: "85px" }}
    >
      <Grid item xs={9}>
        <AppBar className={classes.appBar} position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            selectionFollowsFocus
          >
            <Tab
              className={`${classes.tab} tab`}
              {...a11yProps(0)}
              label="Team Information"
            />
            <Tab
              className={`${classes.tab} tab`}
              {...a11yProps(1)}
              label="Proficiency Approval Requests"
            />
            <Tab
              className={`${classes.tab} tab`}
              {...a11yProps(2)}
              label="Custom Skills Gap Analysis"
            />
            <Tab
              className={`${classes.tab} tab`}
              {...a11yProps(3)}
              label="Update Ideal Proficiency"
            />
          </Tabs>
        </AppBar>
      </Grid>
      <Grid item xs={12}>
        <TabPanel value={value} index={0}>
          <TeamInfo profile={profile} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ProficiencyApprovalRequests profile={profile} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <CustomSkillsGapAnalysis profile={profile} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <UpdateIdealProficiency profile={profile} />
        </TabPanel>
      </Grid>
    </Grid>
  ) : null;
}

export default MyTeam;
