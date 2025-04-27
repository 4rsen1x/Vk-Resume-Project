import React, { useState } from 'react';
import { 
  Group, 
  FormItem, 
  Input, 
  Textarea, 
  Avatar, 
  Button, 
  Select, 
  Div, 
  File,
  ModalRoot
} from '@vkontakte/vkui';
import { Icon24Camera } from '@vkontakte/icons';
import PropTypes from 'prop-types';
import { EducationForm } from './EducationForm';
import { ExperienceForm } from './ExperienceForm';
import { CustomSectionForm } from './CustomSectionForm';
import { EnhanceButton, EnhancementModal } from '../AIEnhancement';

export const ResumeEditor = ({ 
  userData, 
  selectedTemplate, 
  onInputChange, 
  onEducationChange, 
  onExperienceChange, 
  onSkillsChange, 
  onTemplateChange, 
  onAddEducation, 
  onAddExperience, 
  onRemoveEducation, 
  onRemoveExperience, 
  onCustomSectionChange,
  onAddCustomSection,
  onRemoveCustomSection,
  onMoveCustomSection,
  showTip 
}) => {
  const [activeModal, setActiveModal] = useState(null);
  const [enhancementData, setEnhancementData] = useState({
    text: '',
    fieldName: '',
    fieldType: '',
    index: null,
    subField: null
  });

  const openEnhancementModal = (text, fieldName, fieldType, index = null, subField = null) => {
    setEnhancementData({ text, fieldName, fieldType, index, subField });
    setActiveModal('enhancement');
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleAcceptEnhancement = (enhancedText) => {
    const { fieldType, index, subField } = enhancementData;
    
    switch (fieldType) {
      case 'input':
        onInputChange(enhancementData.fieldName, enhancedText);
        break;
      case 'skills':
        onSkillsChange({ target: { value: enhancedText } });
        break;
      case 'education':
        onEducationChange(index, subField, enhancedText);
        break;
      case 'experience':
        onExperienceChange(index, subField, enhancedText);
        break;
      case 'customSection':
        onCustomSectionChange(index, subField, enhancedText);
        break;
      default:
        break;
    }
  };

  const modal = (
    <ModalRoot activeModal={activeModal} onClose={closeModal}>
      <EnhancementModal
        id="enhancement"
        onClose={closeModal}
        originalText={enhancementData.text}
        fieldName={enhancementData.fieldName}
        onAccept={handleAcceptEnhancement}
      />
    </ModalRoot>
  );

  return (
    <Group>
      {modal}
      <Group>
        <FormItem top="Фото">
          <File
            before={<Icon24Camera />}
            size="m"
            mode="secondary"
            accept="image/*"
          >
            {userData.photo ? 'Изменить фото' : 'Загрузить фото'}
          </File>
          {userData.photo && (
            <Div style={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar size={100} src={userData.photo} />
            </Div>
          )}
        </FormItem>

        <FormItem top="Имя">
          <Input
            value={userData.firstName}
            onChange={(e) => onInputChange('firstName', e.target.value)}
          />
        </FormItem>

        <FormItem top="Фамилия">
          <Input
            value={userData.lastName}
            onChange={(e) => onInputChange('lastName', e.target.value)}
          />
        </FormItem>

        <FormItem top="Email">
          <Input
            type="email"
            value={userData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="example@mail.com"
          />
        </FormItem>

        <FormItem top="Телефон">
          <Input
            type="tel"
            value={userData.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
            placeholder="+7 (999) 123-45-67"
          />
        </FormItem>

        <FormItem top="Должность">
          <Input
            value={userData.position}
            onChange={(e) => onInputChange('position', e.target.value)}
            placeholder="Frontend Developer"
            after={
              <EnhanceButton 
                onClick={() => openEnhancementModal(userData.position, 'должность', 'input', null, 'position')} 
              />
            }
          />
        </FormItem>
      </Group>

      <Group>
        <FormItem top="Шаблон резюме">
          <Select
            value={selectedTemplate}
            onChange={onTemplateChange}
            options={[
              { value: 'classic', label: 'Классический' },
              { value: 'modern', label: 'Современный' },
              { value: 'creative', label: 'Креативный' }
            ]}
          />
        </FormItem>
      </Group>

      <Group>
        <FormItem top="Навыки (через запятую)">
          <Textarea
            value={userData.skills.join(', ')}
            onChange={onSkillsChange}
            placeholder="React, JavaScript, HTML/CSS"
            after={
              <Div style={{ display: 'flex', gap: 8 }}>
                <EnhanceButton 
                  onClick={() => openEnhancementModal(userData.skills.join(', '), 'навыки', 'skills')} 
                />
                <Button
                  mode="tertiary"
                  onClick={() => showTip('Укажите ключевые навыки, которые важны для вашей профессии')}
                >
                  ?
                </Button>
              </Div>
            }
          />
        </FormItem>
      </Group>

      <Group>
        <EducationForm 
          education={userData.education}
          onEducationChange={onEducationChange}
          onAddEducation={onAddEducation}
          onRemoveEducation={onRemoveEducation}
          showTip={showTip}
          onEnhance={openEnhancementModal}
        />
      </Group>

      <Group>
        <ExperienceForm 
          experience={userData.experience}
          onExperienceChange={onExperienceChange}
          onAddExperience={onAddExperience}
          onRemoveExperience={onRemoveExperience}
          showTip={showTip}
          onEnhance={openEnhancementModal}
        />
      </Group>

      <Group>
        <CustomSectionForm 
          customSections={userData.customSections || []}
          onCustomSectionChange={onCustomSectionChange}
          onAddCustomSection={onAddCustomSection}
          onRemoveCustomSection={onRemoveCustomSection}
          onMoveCustomSection={onMoveCustomSection}
          showTip={showTip}
          onEnhance={openEnhancementModal}
        />
      </Group>
    </Group>
  );
};

ResumeEditor.propTypes = {
  userData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    photo: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    position: PropTypes.string,
    education: PropTypes.array,
    experience: PropTypes.array,
    skills: PropTypes.array,
    customSections: PropTypes.array
  }).isRequired,
  selectedTemplate: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onEducationChange: PropTypes.func.isRequired,
  onExperienceChange: PropTypes.func.isRequired,
  onSkillsChange: PropTypes.func.isRequired,
  onTemplateChange: PropTypes.func.isRequired,
  onAddEducation: PropTypes.func.isRequired,
  onAddExperience: PropTypes.func.isRequired,
  onRemoveEducation: PropTypes.func.isRequired,
  onRemoveExperience: PropTypes.func.isRequired,
  onCustomSectionChange: PropTypes.func.isRequired,
  onAddCustomSection: PropTypes.func.isRequired,
  onRemoveCustomSection: PropTypes.func.isRequired,
  onMoveCustomSection: PropTypes.func.isRequired,
  showTip: PropTypes.func.isRequired
};