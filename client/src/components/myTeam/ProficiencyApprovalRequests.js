//#region Import components
// React components
import React, { useEffect } from "react";
import { connect } from "react-redux";

// Material UI components
// import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import ApproveButton from "../ApproveButton";

import { getProficiencyApprovalRequests } from "../../actions";
import _ from "lodash";
//#endregion

// Theme for Material UI Data Table
// const getMuiTheme = () =>
//   createMuiTheme({
//     overrides: {
//       MUIDataTableBodyCell: {
//         root: {
//           backgroundColor: "#FFFFFF",
//         },
//       },
//     },
//   });

const options = {
  responsive: "standard",
  selectableRows: "none",
  sortFilterList: true,
  sortOrder: {
    name: "date_created",
    direction: "desc",
  },
};

const columns = [
  {
    label: "tmp_id",
    name: "tmp_id",
    options: {
      display: false,
    },
  },
  {
    label: "skill_id",
    name: "skill_id",
    options: {
      display: false,
    },
  },
  {
    label: "Workday ID",
    name: "tm_id",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    label: "Team Member Name",
    name: "tm_name",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    label: "Skill Name",
    name: "skill_desc",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    label: "Personal Rating",
    name: "personal_rating_desc",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    label: "Years of Experience",
    name: "duration_experience",
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
    label: "Ideal Rating",
    name: "proficiency_id_desc",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    label: "Date Submitted",
    name: "date_created",
    options: {
      filter: true,
      sort: true,
    },
  },
];

const ProficiencyApprovalRequests = (props) => {
  const {
    profile,
    getProficiencyApprovalRequests,
    proficiencyApprovalRequests,
  } = props;

  useEffect(() => {
    if (profile) {
      getProficiencyApprovalRequests({ email: profile.email });
    }
    // eslint-disable-next-line
  }, []);

  const muiDataTableColumns = [
    ...columns,
    {
      name: "team_action",
      label: "Approve",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <ApproveButton
              tmp_id={tableMeta.rowData[0]}
              skill_id={tableMeta.rowData[1]}
              skill_desc={tableMeta.rowData[4]}
              profile={profile}
            />
          );
        },
      },
    },
  ];

  return (
    // <MuiThemeProvider theme={getMuiTheme()}>
    <>
      {_.isEmpty(proficiencyApprovalRequests) ? null : (
        <MUIDataTable
          data={proficiencyApprovalRequests}
          columns={muiDataTableColumns}
          options={options}
        />
      )}
    </>
    // </MuiThemeProvider>
  );
};

const mapStateToProps = (state) => ({
  proficiencyApprovalRequests: state.proficiencyApprovalRequests,
  proficiencies: state.proficiencies,
});

export default connect(mapStateToProps, {
  getProficiencyApprovalRequests,
})(ProficiencyApprovalRequests);
