import React from 'react';
import './Style/Courses.css';

const Courses = () => {
    return (
        <div className="courses-container">
            <h1>All Courses</h1>
            <div className="course-list">
                {/* Render a list of courses */}
                <div className="course-item">Course 1</div>
                <div className="course-item">Course 2</div>
                <div className="course-item">Course 3</div>
                <div className="course-item">Course 4</div>
            </div>
        </div>
    );
};

export default Courses;
