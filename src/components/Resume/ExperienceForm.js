import React from 'react';
import { 
  FormItem, 
  Input, 
  Textarea, 
  Button, 
  IconButton 
} from '@vkontakte/vkui';
import { Icon24Cancel } from '@vkontakte/icons';
import PropTypes from 'prop-types';

export const ExperienceForm = ({ 
  experience, 
  onExperienceChange, 
  onAddExperience, 
  onRemoveExperience, 
  showTip 
}) => {
  return (
    <FormItem top="Опыт работы">
      {experience.map((exp, index) => (
        <div key={index} style={{ marginBottom: 15, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
            <IconButton 
              onClick={() => onRemoveExperience(index)}
              aria-label="Удалить опыт работы"
            >
              <Icon24Cancel />
            </IconButton>
          </div>
          <FormItem top="Компания">
            <Input
              value={exp.company}
              onChange={(e) => onExperienceChange(index, 'company', e.target.value)}
              placeholder="Название компании"
            />
          </FormItem>
          <FormItem top="Должность">
            <Input
              value={exp.position}
              onChange={(e) => onExperienceChange(index, 'position', e.target.value)}
              placeholder="Frontend Developer"
            />
          </FormItem>
          <FormItem top="Период работы">
            <Input
              value={exp.period}
              onChange={(e) => onExperienceChange(index, 'period', e.target.value)}
              placeholder="2020 - настоящее время"
            />
          </FormItem>
          <FormItem top="Описание обязанностей">
            <Textarea
              value={exp.description}
              onChange={(e) => onExperienceChange(index, 'description', e.target.value)}
              placeholder="Разработка и поддержка веб-приложений с использованием React"
              after={
                <Button
                  mode="tertiary"
                  onClick={() => showTip('Опишите ваши основные достижения и обязанности на этой позиции')}
                >
                  ?
                </Button>
              }
            />
          </FormItem>
        </div>
      ))}
      <Button size="m" mode="secondary" onClick={onAddExperience}>
        Добавить опыт работы
      </Button>
    </FormItem>
  );
};

ExperienceForm.propTypes = {
  experience: PropTypes.arrayOf(
    PropTypes.shape({
      company: PropTypes.string,
      position: PropTypes.string,
      period: PropTypes.string,
      description: PropTypes.string
    })
  ).isRequired,
  onExperienceChange: PropTypes.func.isRequired,
  onAddExperience: PropTypes.func.isRequired,
  onRemoveExperience: PropTypes.func.isRequired,
  showTip: PropTypes.func.isRequired
};