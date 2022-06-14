//#region Import components
// React components
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

// Material UI components
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import MUIDataTable from "mui-datatables";

import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core";
import theme from "../theme/theme";

// Common utils and actions
import SkillDialog from "../SkillDialog";
import { getTmInfo, getTmTechInfo } from "../../actions";

//#endregion

//Extend the Theme
const innerTheme = createTheme({
  ...theme,
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        cursor: "pointer",
      },
    },
  },
});

function TechnicalInfo(props) {
  // Constants initialization
  const {
    profile,
    getTmInfo,
    tmInfo,
    getTmTechInfo,
    tmTechInfo,
    proficiencies,
    skills,
    tmEmail,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [isAction, setIsAction] = useState("");
  const [currSkill, setCurrSkill] = useState("");
  const [currProficiency, setCurrProficiency] = useState("");

  const [years, setYears] = useState({});
  const [months, setMonths] = useState({});
  const [lastUsed, setLastUsed] = useState("");

  useEffect(() => {
    if (profile || tmEmail) {
      getTmInfo({ email: tmEmail ? tmEmail : profile.email });
      getTmTechInfo({ email: tmEmail ? tmEmail : profile.email });
    }
    // eslint-disable-next-line
  }, []);

  // Explicitly define columns and its options
  const columns = [
    {
      name: "skill_desc",
      label: "Skill/Technology",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "personal_rating",
      label: "Personal Rating",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "duration_experience",
      label: "Years of Experience",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "lastused_experience",
      label: "Last Used",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "manager_rating",
      label: "Manager Rating",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "skill_cat_desc",
      label: "Category",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "approval_flag",
      label: "Status",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "approval_reason",
      label: "Remarks",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "created_by",
      label: "Created by",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "date_created",
      label: "Date Created",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "updated_by",
      label: "Updated by",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "date_updated",
      label: "Date Updated",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "approved_by",
      label: "Approved by",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "date_approved",
      label: "Date Approved",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  // Options for Material UI Data Table
  const options = {
    responsive: "standard",
    selectableRows: "none",
    onRowClick: (row) => {
      handleChangeValues(row[0]);
      handleChangeValues(row[1]);
      setIsAction("UPDATE");
      setIsOpen(true);
    },
    sortFilterList: true,
  };

  // Updating current skill and proficiency state values
  const handleChangeValues = (description) => {
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

  const techInfoState = {
    isAction,
    isOpen,
    setIsOpen,
    currSkill,
    setCurrSkill,
    currProficiency,
    setCurrProficiency,
    handleChangeValues,
  };

  return (
    <ThemeProvider theme={innerTheme}>
      <Grid container spacing={3}>
        {tmInfo &&
        profile.email.toLowerCase() === tmInfo.email.toLowerCase() ? (
          <Grid item xs={12}>
            <Button
              onClick={() => {
                setIsAction("ADD");
                setIsOpen(true);
              }}
              variant="contained"
              color="primary"
            >
              <Icon>add_circle</Icon>&nbsp; Add Skills
            </Button>
          </Grid>
        ) : null}
        {profile && tmTechInfo ? (
          <Grid item xs={12}>
            <MUIDataTable
              title=""
              data={tmTechInfo}
              columns={columns}
              options={options}
            />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <h2 style={{ fontFamily: "HelveticaNeueLTStd-Lt" }}>
              {tmEmail
                ? "This Team Member has no technical information"
                : "You currently have no skills, add one now!"}
            </h2>
          </Grid>
        )}
      </Grid>
      <SkillDialog
        profile={profile}
        tmInfo={tmInfo}
        parentState={techInfoState}
      />
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => ({
  tmInfo: state.tmInfo,
  tmTechInfo: state.tmTechInfo,
  skills: state.skills,
  proficiencies: state.proficiencies,
});

export default connect(mapStateToProps, {
  getTmInfo,
  getTmTechInfo,
})(TechnicalInfo);
