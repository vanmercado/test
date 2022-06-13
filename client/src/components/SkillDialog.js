//#region Import components
// React components
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

// Material UI components
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";

// Common utils and actions
import axios from "axios";
import {
  createTmProficiency,
  updateTmProficiency,
  deleteTmProficiency,
  getProficiencyApprovalRequests,
  getTmTechInfo,
  getProficiencies,
  getSkills,
} from "../actions";

import IdealSkillSet from "./IdealSkillSet";
import { Typography } from "@material-ui/core";
//#endregion

function SkillDialog(props) {
  const {
    profile,
    tmInfo,
    getTmTechInfo,
    getProficiencyApprovalRequests,
    createTmProficiency,
    updateTmProficiency,
    deleteTmProficiency,
    getProficiencies,
    proficiencies,
    getSkills,
    skills,
  } = props;

  const {
    isAction,
    isOpen,
    setIsOpen,
    isApprove,
    tmp_id,
    currSkill,
    setCurrSkill,
    currProficiency,
    setCurrProficiency,
  } = props.parentState;

  const yrmin = 0;
  const yrmax = 99;
  const mosmin = 0;
  const mosmax = 11;

  const [years, setYears] = useState({});
  const [months, setMonths] = useState({});
  const [lastUsed, setLastUsed] = useState({});

  let { handleChangeValues } = props.parentState;

  const [remarks, setRemarks] = useState("");
  const [initialProficiency, setInitialProficiency] = useState({});
  const [profileInfo, setProfileInfo] = useState({});

  useEffect(() => {
    if (!profile.tm_id) {
      axios
        .post("/api/tm/info", { email: profile.email })
        .then((res) => setProfileInfo(res.data.data));
    } else {
      setProfileInfo(profile);
    }

    getProficiencies();
    getSkills();
    return () => {
      setProfileInfo({});
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setInitialProficiency(currProficiency);
    // eslint-disable-next-line
  }, [isOpen]);

  if (!handleChangeValues) {
    // Updating current skill and proficiency state values
    handleChangeValues = (description) => {
      // If the description is existing from the proficiencies array of objects
      if (
        proficiencies.some((proficiency) =>
          proficiency.proficiency_desc.includes(description)
        )
      ) {
        setCurrProficiency(
          proficiencies.find(
            (proficiency) => proficiency.proficiency_desc === description
          )
        );
      } else {
        setCurrSkill(skills.find((skill) => skill.skill_desc === description));
      }
    };
  }

  //Will appear when no skill found
  const noSkillAddButton = (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <h4>No results found</h4>
      <Button
        variant="outlined"
        color="primary"
        onMouseDown={() => {
          window.parent.open("https://forms.gle/iB2zR4zd4yhFSqp28");
          handleClearValuesAndClose();
        }}
      >
        Request to add skill
      </Button>
    </Box>
  );

  // Clear current skill and proficiency state values
  const handleClearValuesAndClose = () => {
    if (setCurrSkill) setCurrSkill("");
    if (setCurrProficiency) setCurrProficiency("");
    if (setYears) setYears("");
    if (setMonths) setMonths("");
    if (setLastUsed) setLastUsed("");
    setIsOpen(false);
  };

  // Template of required columns in the team_member_proficiency table
  var skillProficiencyDataSet = {
    tm_id: tmInfo ? tmInfo.tm_id : null,
    skill_id: currSkill ? currSkill.skill_id : null,

    // job_profile_id: tmInfo ? tmInfo.job_profile_id : null,
    // team_id: tmInfo ? tmInfo.team_id : null,

    created_by: profileInfo ? profileInfo.tm_id : null,
    updated_by: profileInfo ? profileInfo.tm_id : null,
  };

  const addProficiency = () => {
    if (profileInfo.tm_id !== tmInfo.tm_id) {
      // For team leads adding a team member's skill
      skillProficiencyDataSet.proficiency_id = currProficiency
        ? currProficiency.proficiency_id
        : null;
      skillProficiencyDataSet.personal_rating = currProficiency
        ? currProficiency.proficiency_id
        : null;
      skillProficiencyDataSet.approval_flag = "A";
      skillProficiencyDataSet.approval_reason = "Added by Team Lead";
      skillProficiencyDataSet.created_by = profileInfo.tm_id;
      skillProficiencyDataSet.updated_by = profileInfo.tm_id;
      skillProficiencyDataSet.date_approved = Date.now();
      skillProficiencyDataSet.approved_by = profileInfo.tm_id;
      createTmProficiency(skillProficiencyDataSet);
      handleClearValuesAndClose();
    } else {
      // For members adding his/her skill
      skillProficiencyDataSet.personal_rating = currProficiency
        ? currProficiency.proficiency_id
        : null;
      skillProficiencyDataSet.years_experience = years;
      skillProficiencyDataSet.andmonths_experience = months;
      skillProficiencyDataSet.lastused_experience = lastUsed;
      createTmProficiency(skillProficiencyDataSet).then((res) =>
        getTmTechInfo({ email: tmInfo.email })
      );
      handleClearValuesAndClose();
    }
  };

  const updateSkill = () => {
    if (isApprove) {
      const now = new Date();

      updateTmProficiency({
        tmp_id: tmp_id,
        approval_flag: "A",
        date_updated: now,
        // updated_by: profileInfo.tm_id,
        updated_by: profile.tm_id,
        approval_reason: remarks,
        proficiency_id: currProficiency.proficiency_id,
        date_approved: now,
        // approved_by: profileInfo.tm_id,
        approved_by: profile.tm_id,
      }).then((res) => {
        getProficiencyApprovalRequests({ email: profile.email });
        setRemarks("");
      });
    } else if (
      currProficiency.proficiency_id !== initialProficiency.proficiency_id
    ) {
      if (profileInfo.tm_id !== tmInfo.tm_id) {
        skillProficiencyDataSet.proficiency_id = currProficiency
          ? currProficiency.proficiency_id
          : null;
      } else {
        skillProficiencyDataSet.personal_rating = currProficiency
          ? currProficiency.proficiency_id
          : null;
        skillProficiencyDataSet.approved_by = null;
        skillProficiencyDataSet.date_approved = null;
        skillProficiencyDataSet.approval_flag = "P";
      }
      updateTmProficiency(skillProficiencyDataSet).then((res) =>
        getTmTechInfo({ email: tmInfo.email })
      );
    }
    handleClearValuesAndClose();
  };

  return (
    <Dialog
      title="Skill Information"
      open={isOpen}
      onClose={() => handleClearValuesAndClose()}
      aria-labelledby="responsive-dialog-title"
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle id="responsive-dialog-title">Skill Information</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Grid container spacing={2}>
              {!isApprove ? (
                <Grid item xs={12}>
                  <DialogContentText>
                    Note: All added skills are subject for review by your
                    respective team leads.
                  </DialogContentText>
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <InputLabel htmlFor="skills">
                  Skill Set / Technology / Application
                </InputLabel>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  size="small"
                  id="skill_id"
                  options={skills}
                  value={currSkill ? currSkill : null}
                  disabled={isAction === "UPDATE" ? true : false}
                  getOptionSelected={(option, value) =>
                    value ? option.id === value.id : null
                  }
                  onChange={(event) =>
                    handleChangeValues(event.target.textContent)
                  }
                  getOptionLabel={(option) => option.skill_desc}
                  style={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select skill"
                      variant="outlined"
                    />
                  )}
                  noOptionsText={noSkillAddButton}
                />
              </Grid>
              <Grid item xs={12}></Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="rating">
                  Personal Proficiency Level Rating
                </InputLabel>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  size="small"
                  id="personal_rating"
                  options={proficiencies}
                  value={currProficiency ? currProficiency : null}
                  getOptionSelected={(option, value) =>
                    value ? option.id === value.id : null
                  }
                  onChange={(event) =>
                    handleChangeValues(event.target.textContent)
                  }
                  getOptionLabel={(option) => option.proficiency_desc}
                  style={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select proficiency"
                      variant="outlined"
                    />
                  )}
                  noOptionsText="No results found"
                />
              </Grid>
              {/* task  */}
              <Grid item xs={12}></Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="rating">Years of Experience</InputLabel>
              </Grid>
              <Grid item xs={12}>
                {/* year  */}
                <TextField
                  type="number"
                  id="years_experience"
                  size="small"
                  label="Years"
                  variant="outlined"
                  style={{ width: "150px", marginRight: "25px" }}
                  inputProps={{ yrmin, yrmax, style: { textAlign: "center" } }}
                  value={years}
                  onChange={(e) => {
                    var value = parseInt(e.target.value);

                    if (value > yrmax) value = yrmax;
                    if (value < yrmin) value = yrmin;

                    setYears(value);
                  }}
                />
                {/* months  */}
                <TextField
                  type="number"
                  id="andmonths_experience"
                  size="small"
                  variant="outlined"
                  label="Months"
                  style={{ width: "150px", marginRight: "25px" }}
                  inputProps={{
                    mosmin,
                    mosmax,
                    style: { textAlign: "center" },
                  }}
                  value={months}
                  onChange={(e) => {
                    var value = parseInt(e.target.value);

                    if (value > mosmax) value = mosmax;
                    if (value < mosmin) value = mosmin;

                    setMonths(value);
                  }}
                />
                {/* lastused  */}
                <TextField
                  type="number"
                  id="lastused_experience"
                  size="small"
                  variant="outlined"
                  style={{ width: "150px" }}
                  label="Last Used"
                  erorText="Please enter only 4 digits number"
                  value={lastUsed}
                  onChange={(e) => setLastUsed(e.target.value.substring(0, 4))}
                  inputProps={{ style: { textAlign: "center" } }}
                  helperText="e.g. 2005"
                />
              </Grid>
              {/* task  */}
              {isApprove ? (
                <>
                  <Grid item xs={12}></Grid>
                  <Grid item xs={12}>
                    <InputLabel htmlFor="remarks">Remarks</InputLabel>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="remarks"
                      value={remarks}
                      onChange={(event) => setRemarks(event.target.value)}
                      variant="outlined"
                      style={{ width: "100%" }}
                    />
                  </Grid>
                </>
              ) : null}
            </Grid>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h6" component="h6">
              Baseline skillset for your Job Profile
            </Typography>
            <IdealSkillSet email={profile.email} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setRemarks("");
            handleClearValuesAndClose();
          }}
          color="primary"
        >
          Close
        </Button>
        {isAction === "ADD" ? (
          <Button
            onClick={addProficiency}
            color="primary"
            autoFocus
            disabled={
              currProficiency && currSkill && years && months && lastUsed
                ? false
                : true
            }
          >
            Save
          </Button>
        ) : (
          <>
            <Button
              onClick={updateSkill}
              color="primary"
              autoFocus
              disabled={currProficiency ? false : true}
            >
              Update
            </Button>
            {!isApprove ? (
              <Button
                onClick={() => {
                  deleteTmProficiency(skillProficiencyDataSet).then((res) =>
                    getTmTechInfo({ email: tmInfo.email })
                  );
                  handleClearValuesAndClose();
                }}
                color="primary"
                autoFocus
              >
                Delete
              </Button>
            ) : null}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

const mapStateToProps = (state) => ({
  proficiencies: state.proficiencies,
  skills: state.skills,
});

export default connect(mapStateToProps, {
  createTmProficiency,
  updateTmProficiency,
  deleteTmProficiency,
  getProficiencyApprovalRequests,
  getTmTechInfo,
  getProficiencies,
  getSkills,
})(SkillDialog);
