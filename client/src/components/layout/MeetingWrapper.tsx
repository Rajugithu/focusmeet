import React from "react";
import { useParams } from "wouter";
import MeetingPage from "../../pages/MeetingPage";
import MeetingComponent from "../layout/MeetingComponent";

const MeetingWrapper: React.FC = () => {
    const params = useParams();
    const meetingId = params.meetingId || ""; // Ensure it's always a string

    return (
        <>
            <MeetingPage />
            <MeetingComponent meetingId={meetingId} />
        </>
    );
};

export default MeetingWrapper;
