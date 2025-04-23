import React from 'react';
import { Div, Button } from '@vkontakte/vkui';
import { Icon24Document } from '@vkontakte/icons';
import PropTypes from 'prop-types';
import { ResumeTemplates } from './ResumeTemplates';

export const ResumePreview = ({ 
  userData, 
  selectedTemplate, 
  resumeRef, 
  onDownloadResume 
}) => {
  return (
    <div>
      <Div>
        <Button 
          before={<Icon24Document />} 
          size="m" 
          mode="primary" 
          onClick={() => onDownloadResume('PDF')}
          stretched
        >
          Скачать PDF
        </Button>
      </Div>
      <Div>
        <div ref={resumeRef}>
          <ResumeTemplates 
            templateType={selectedTemplate} 
            userData={userData} 
          />
        </div>
      </Div>
    </div>
  );
};

ResumePreview.propTypes = {
  userData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    photo: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    position: PropTypes.string,
    education: PropTypes.array,
    experience: PropTypes.array,
    skills: PropTypes.array
  }).isRequired,
  selectedTemplate: PropTypes.string.isRequired,
  resumeRef: PropTypes.object.isRequired,
  onDownloadResume: PropTypes.func.isRequired
};