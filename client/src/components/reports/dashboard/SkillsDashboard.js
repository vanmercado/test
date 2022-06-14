import React, { useEffect, useState } from "react";

import { Box, Grid } from "@material-ui/core";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {
  startOfMonth,
  format,
  parseISO,
} from "date-fns";
import moment from 'moment';

import Chart from "./Chart";
import DataTable from "./DataTable";

import { useDispatch, useSelector } from "react-redux";

import { getAllTmTechInfo } from "../../../actions";

const columns = [
  {
    name: "tm_name",
    label: "Name",
    options: {
      filter: true,
      display: true,
    },
  },
  {
    name: "date_created",
    label: "Date Added",
    options: {
      filter: true,
      sort: true,
      display: true,
      sortDirection: "desc",
    },
  },
  {
    name: "skill_desc",
    label: "Skill",
    options: {
      filter: true,
      display: true,
    },
  },
  {
    name: "personal_rating",
    label: "Personal Rating",
    options: {
      filter: true,
      display: true,
    },
  },
];

const createDate = (start, end) => {
  const arr = []
  const dt = new Date(start);

  while (dt <= end) {
    arr.push(format(new Date(dt), "yyyy-MM-dd"));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
};

export default function SkillsDashboard() {
  const allTmTechInfo = useSelector((state) => state.getAllTmTechInfo);
  const dispatch = useDispatch();

  const firstDayOfMonth = startOfMonth(new Date());
  const today = new Date();
  const [fromSelectedDate, setFromSelectedDate] = useState(firstDayOfMonth);
  const [toSelectedDate, setToSelectedDate] = useState(today);

  const [interval, setInterval] = useState(0);
  const dates = createDate(fromSelectedDate, toSelectedDate);
  const data = [];
  const data2 = [];
  const handleChange = (event) => {
    setInterval(event.target.value);
  };

  const formattedDataPerWeek = dates.map((date) => {
    let userCount = 0;
    allTmTechInfo &&
    allTmTechInfo.forEach((item) => {
        const formatted_date_created = moment(item.date_created).day("Sunday").format("YYYY-MM-DD")
          
        ;
        const isEqualWeek = formatted_date_created === moment(date).day("Sunday").format("YYYY-MM-DD");
        
        if (isEqualWeek) {
          userCount = userCount + 1;
          data2.push({
            ...item,
            date_created: formatted_date_created,
          });
        }


      });
    return {
      day: moment(date).day("sunday").format('DD'),
      userCount,
      date: format(parseISO(date), "MMM dd, yyyy"),
      tag: "skills",
    };
  });
  

  const formattedData = dates.map((date) => {
    let userCount = 0;
    allTmTechInfo &&
      allTmTechInfo.forEach((item) => {
        const isDateEqual = item.date_created === date;
        if (isDateEqual) {
          userCount = userCount + 1;
          data.push({
            ...item,
            date_created: format(parseISO(item.date_created), "MMM dd, yyyy"),
          });
        }
      });
    return {
      day: format(parseISO(date), "dd"),
      userCount,
      date: format(parseISO(date), "MMM dd, yyyy"),
      tag: "skills",
    };
  });

  const handleFromSelectedDate = (date) => {
    setFromSelectedDate(date);
  };

  const handleToSelectedDate = (date) => {
    setToSelectedDate(date);
  };

  useEffect(() => {
    dispatch(getAllTmTechInfo());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Box component="span" m={3}>
            <DatePicker
              label="From:"
              value={fromSelectedDate}
              onChange={handleFromSelectedDate}
              format="MMMM dd, yyyy"
              disableFuture
              maxDate={today}
              // minDate={addDays(toSelectedDate, -30)}
              showTodayButton
            />
          </Box>
          <Box component="span" m={3}>
            <DatePicker
              label="To:"
              value={toSelectedDate}
              onChange={handleToSelectedDate}
              format="MMMM dd, yyyy"
              disableFuture
              // maxDate={addDays(fromSelectedDate, 30)}
              minDate={fromSelectedDate}
              showTodayButton
            />
          </Box>
        </MuiPickersUtilsProvider>
      </Grid>
      <Grid>
      <FormControl>
        <InputLabel id="demo-simple-select-label">group by</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={interval}
          onChange={handleChange}
        >
          <MenuItem value={0}>day</MenuItem>
          <MenuItem value={7}>week</MenuItem>
          
        </Select>
      </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Chart data={formattedData} data2={formattedDataPerWeek} title={"Team Member Skills"} interval={interval} />
      </Grid>

      <Grid item xs={12}>
        <Box mt={5}>
          <DataTable data={data} columns={columns} />
        </Box>
      </Grid>
    </Grid>
  );
}
