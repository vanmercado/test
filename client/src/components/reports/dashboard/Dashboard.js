import React, { useState } from "react";

import {
  Grid,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Box,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core";

import LoginDashboard from "./LoginDashboard";
import SkillsDashboard from "./SkillsDashboard";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: "200px",
  },
  contentSpacing: {
    marginTop: "50px",
  },
}));
export default function Dashboard() {
  const classes = useStyles();
  const [dashboardOption, setDashboardOption] = useState("activeUsers");

  const handleDashboardOption = (event) => {
    setDashboardOption(event.target.value);
  };
  const displayDashboard =
    dashboardOption === "activeUsers" ? (
      <LoginDashboard />
    ) : (
      <SkillsDashboard />
    );
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <InputLabel id="select-label">Select</InputLabel>
            <Select
              labelId="select-label"
              id="select"
              value={dashboardOption}
              onChange={handleDashboardOption}
            >
              <MenuItem value={"activeUsers"}>Active Users</MenuItem>
              <MenuItem value={"skills"}>Skills</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box m={3}>{displayDashboard}</Box>
    </>
  );
}
