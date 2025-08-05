import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Typography from "@mui/material/Typography";

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);

  const routeTo = useNavigate();
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        if (Array.isArray(history)) {
          setMeetings(history);
        } else if (history && Array.isArray(history.data)) {
          setMeetings(history.data);
        } else {
          setMeetings([]); // fallback to empty
        }
      } catch (e) {
        console.log(e);
        //snackbar
      }
    };
    fetchHistory();
  }, []);

  let formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  return (
    <div>
      <IconButton
        onClick={() => {
          routeTo("/home");
        }}
      >
        <HomeIcon />
        
      </IconButton>
      <img src='/image.png' alt='logo' style={{position:"absolute",top:"0", height:"3rem",width:"auto",gap:"1rem",right:"0",marginInline:"1rem"}}/>

      {Array.isArray(meetings) && meetings.length > 0 ? (
        meetings.map((e, i) => (
          <Card key={i} sx={{ minWidth: 275 }} variant="outlined">
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Code: {e.meetingCode}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Date: {formatDate(e.date)}
              </Typography>
            </CardContent>
           
          </Card>
        ))
      ) : (
        <Typography>No meetings found</Typography>
      )}
    </div>
  );
}
