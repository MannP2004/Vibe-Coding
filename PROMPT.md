# StudySpace – AI Development Prompt Log

## Project Overview

**Project:** StudySpace – Student Study Planner  
**Technologies:** HTML, CSS, JavaScript, Local Storage  
**AI Assistant:** ChatGPT  
**Development Environment:** Visual Studio Code  
**Repository:** https://github.com/MannP2004/Vibe-Coding

This document records the main AI-assisted development stages used to create StudySpace.

**Note:** The prompts below are reconstructed summaries of the development requests and iterations. They are not presented as a verbatim export of the original conversation.

---

## Stage 1 – Planning and Core Dashboard (V1)

### Goal

Create a functional student study planner with a clean dashboard.

### Main Prompt Summary

"Help me create a student study planner using HTML, CSS, and JavaScript. I want students to add tasks with a title, subject, priority, and due date. Include options to complete and delete tasks, filter tasks by status, and display progress statistics. Save tasks using Local Storage."

### AI Assistance

- Generated the initial HTML structure.
- Created the CSS styling for the dashboard.
- Implemented JavaScript task functionality.
- Added task filters and progress statistics.
- Added Local Storage to preserve tasks after refreshing.

### Development Result

The first version of StudySpace was created with a working task dashboard. The initial version was tested in a browser and the user confirmed that it worked.

---

## Stage 2 – Improving Task Management (V2)

### Goal

Make task management more useful and organized.

### Main Prompt Summary

"Improve the existing StudySpace project. Add the ability to edit tasks with save and cancel options. Organize tasks using due dates and display overdue labels. Preserve the existing task features, filters, progress statistics, and Local Storage."

### AI Assistance

- Added task editing functionality.
- Added save and cancel actions.
- Improved due-date organization.
- Added overdue task indicators.
- Preserved the existing dashboard features.

### Development Result

The second version expanded the original dashboard with more complete task management functionality.

---

## Stage 3 – Calendar Integration (V3)

### Goal

Allow students to view and organize tasks through a calendar.

### Main Prompt Summary

"Continue the StudySpace project by adding a calendar. Include previous and next month navigation, selectable dates, and indicators for dates that contain tasks. Keep the existing task management functionality working."

### AI Assistance

- Added the calendar interface.
- Implemented month navigation.
- Added date selection.
- Connected calendar dates with scheduled tasks.
- Adjusted CSS to improve the calendar layout.

### Debugging and Iteration

During development, a CSS media query issue affected the calendar layout. The CSS was reviewed and corrected to resolve the layout problem.

### Development Result

The calendar became an additional way to view scheduled tasks and deadlines.

---

## Stage 4 – Visual Improvements and Theme Toggle (V4)

### Goal

Improve the application's appearance and add a theme option.

### Main Prompt Summary

"Improve the StudySpace interface and add a light/dark theme toggle. Keep the existing dashboard, task management, calendar, and Local Storage functionality working. Save the selected theme so it remains after refreshing the page."

### AI Assistance

- Improved the visual presentation.
- Added a light/dark theme toggle.
- Added theme preference persistence using Local Storage.
- Preserved the existing task and calendar functionality.

### Development Result

The fourth version added a theme option and completed the planned feature iterations.

---

## Testing and Verification

The application was tested in a browser during development.

The main features checked included:

- Adding tasks.
- Editing tasks.
- Deleting tasks.
- Completing tasks.
- Filtering tasks.
- Viewing progress statistics.
- Navigating between calendar months.
- Selecting calendar dates.
- Switching between light and dark themes.
- Refreshing the application to check saved data and theme preferences.

The final version was tested by the developer before preparing the project for submission.

---

## What I Learned from AI-Assisted Development

Working with AI helped me understand how to develop an application through smaller steps instead of trying to build everything at once.

I learned that AI can generate code quickly, but its output still needs to be reviewed and tested. Debugging, improving prompts, and checking whether older features still work were important parts of the development process.

AI assisted with the implementation, but I remained responsible for testing the application and understanding the project I created.