import React from "react";
import { useParams } from "wouter";
//import MeetingPage from "../../pages/MeetingPage";
import TeacherPage from "@/pages/TeacherPage";
//import StudentPage from "@/pages/StudentPage"
import MeetingComponent from "../layout/MeetingComponent";

const MeetingWrapper: React.FC = () => {
    const params = useParams();
    const meetingId = params.meetingId || ""; // Ensure it's always a string

    return (
        <>
            <TeacherPage />
            debugger;
            {/* <MeetingComponent meetingId={meetingId} /> */}
        </>
       
    );
};

export default MeetingWrapper;
