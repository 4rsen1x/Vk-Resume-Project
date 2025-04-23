import React from 'react';
import { 
  FormItem, 
  Input, 
  Button, 
  IconButton,
  Div
} from '@vkontakte/vkui';
import { Icon24Cancel } from '@vkontakte/icons';
import PropTypes from 'prop-types';
import { EnhanceButton } from '../AIEnhancement';

export const EducationForm = ({ 
  education, 
  onEducationChange, 
  onAddEducation, 
  onRemoveEducation, 
  showTip,
  onEnhance
}) => {
  return (
    <FormItem top="Образование">
      {education.map((edu, index) => (
        <div key={index} style={{ marginBottom: 15, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
            <IconButton 
              onClick={() => onRemoveEducation(index)}
              aria-label="Удалить образование"
            >
              <Icon24Cancel />
            </IconButton>
          </div>
          <FormItem top="Учебное заведение">
            <Input
              value={edu.institution}
              onChange={(e) => onEducationChange(index, 'institution', e.target.value)}
              placeholder="Название университета/колледжа"
              after={
                <EnhanceButton 
                  onClick={() => onEnhance(edu.institution, 'учебное заведение', 'education', index, 'institution')} 
                />
              }
            />
          </FormItem>
          <FormItem top="Степень/Специальность">
            <Input
              value={edu.degree}
              onChange={(e) => onEducationChange(index, 'degree', e.target.value)}
              placeholder="Бакалавр информатики"
              after={
                <EnhanceButton 
                  onClick={() => onEnhance(edu.degree, 'степень/специальность', 'education', index, 'degree')} 
                />
              }
            />
          </FormItem>
          <FormItem top="Годы обучения">
            <Input
              value={edu.year}
              onChange={(e) => onEducationChange(index, 'year', e.target.value)}
              placeholder="2016-2020"
            />
          </FormItem>
        </div>
      ))}
      <Button size="m" mode="secondary" onClick={onAddEducation}>
        Добавить образование
      </Button>
    </FormItem>
  );
};

EducationForm.propTypes = {
  education: PropTypes.arrayOf(
    PropTypes.shape({
      institution: PropTypes.string,
      degree: PropTypes.string,
      year: PropTypes.string
    })
  ).isRequired,
  onEducationChange: PropTypes.func.isRequired,
  onAddEducation: PropTypes.func.isRequired,
  onRemoveEducation: PropTypes.func.isRequired,
  showTip: PropTypes.func.isRequired,
  onEnhance: PropTypes.func.isRequired
};