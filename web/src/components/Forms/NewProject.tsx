import React, { useState } from 'react';

const NewProject = () => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectDeadline, setProjectDeadline] = useState('');

  const handleProjectNameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setProjectName(event.target.value);
  };

  const handleProjectDescriptionChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setProjectDescription(event.target.value);
  };

  const handleProjectDeadlineChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setProjectDeadline(event.target.value);
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    // Perform the necessary actions with the new project data
    // You can make an API call or handle the logic here
    console.log('Project Name:', projectName);
    console.log('Project Description:', projectDescription);
    console.log('Project Deadline:', projectDeadline);
    // Reset the form fields
    setProjectName('');
    setProjectDescription('');
    setProjectDeadline('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="projectName">Project Name:</label>
        <input
          type="text"
          id="projectName"
          value={projectName}
          onChange={handleProjectNameChange}
        />
      </div>

      <div>
        <label htmlFor="projectDescription">Project Description:</label>
        <textarea
          id="projectDescription"
          value={projectDescription}
          onChange={handleProjectDescriptionChange}
        ></textarea>
      </div>

      <div>
        <label htmlFor="projectDeadline">Project Deadline:</label>
        <input
          type="date"
          id="projectDeadline"
          value={projectDeadline}
          onChange={handleProjectDeadlineChange}
        />
      </div>

      <button type="submit">Create Project</button>
    </form>
  );
};

export default NewProject;