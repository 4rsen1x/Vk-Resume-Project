import React, { useState, useRef } from 'react';
import {
  FormItem,
  Input,
  Textarea,
  Button,
  IconButton,
  Div,
  Card,
  Select, // Keep Select for language proficiency
  ActionSheet,
  ActionSheetItem,
  Platform, // Import Platform
  usePlatform // Import usePlatform hook
} from '@vkontakte/vkui';
import {
  Icon24Cancel,
  Icon24ArrowUp,
  Icon24ArrowDownOutline,
  Icon24Add,
  Icon24ArticleOutline, // Example icon for generic
  Icon24ComputerOutline,           // Example icon for project
  Icon24Education,    // Example icon for certification
  Icon24GlobeOutline    // Example icon for language
} from '@vkontakte/icons';
import PropTypes from 'prop-types';
import { EnhanceButton } from '../AIEnhancement'; // Assuming EnhanceButton is still relevant

// Helper to render fields based on section type
const SectionFields = ({ section, index, onChange, onEnhance }) => {
  switch (section.type) {
    case 'project':
      return (
        <>
          <FormItem top="Название проекта">
            <Input
              value={section.title || ''}
              onChange={(e) => onChange(index, 'title', e.target.value)}
              placeholder="Например: Личный сайт-портфолио"
            />
          </FormItem>
          <FormItem top="Описание проекта">
            <Textarea
              value={section.description || ''}
              onChange={(e) => onChange(index, 'description', e.target.value)}
              placeholder="Краткое описание проекта, его цели и результаты"
              rows={3}
              after={
                <EnhanceButton
                  onClick={() => onEnhance(section.description, 'описание проекта', 'customSection', index, 'description')}
                />
              }
            />
          </FormItem>
          <FormItem top="Технологии">
            <Input
              value={section.technologies || ''}
              onChange={(e) => onChange(index, 'technologies', e.target.value)}
              placeholder="Например: React, Node.js, PostgreSQL"
            />
          </FormItem>
          <FormItem top="Ссылка (необязательно)">
            <Input
              value={section.link || ''}
              onChange={(e) => onChange(index, 'link', e.target.value)}
              placeholder="https://github.com/your/project"
            />
          </FormItem>
        </>
      );
    case 'certification':
      return (
        <>
          <FormItem top="Название сертификата/курса">
            <Input
              value={section.name || ''}
              onChange={(e) => onChange(index, 'name', e.target.value)}
              placeholder="Например: AWS Certified Solutions Architect"
            />
          </FormItem>
          <FormItem top="Организация">
            <Input
              value={section.organization || ''}
              onChange={(e) => onChange(index, 'organization', e.target.value)}
              placeholder="Например: Amazon Web Services"
            />
          </FormItem>
          <FormItem top="Дата получения">
            <Input
              value={section.date || ''}
              onChange={(e) => onChange(index, 'date', e.target.value)}
              placeholder="Например: Май 2023"
            />
          </FormItem>
        </>
      );
    case 'language':
      return (
        <>
          <FormItem top="Язык">
            <Input
              value={section.language || ''}
              onChange={(e) => onChange(index, 'language', e.target.value)}
              placeholder="Например: Английский"
            />
          </FormItem>
          <FormItem top="Уровень владения">
            <Select
              value={section.proficiency || 'native'}
              onChange={(e) => onChange(index, 'proficiency', e.target.value)}
              options={[
                { value: 'native', label: 'Родной' },
                { value: 'fluent', label: 'Свободное владение (C1/C2)' },
                { value: 'advanced', label: 'Продвинутый (B2)' },
                { value: 'intermediate', label: 'Средний (B1)' },
                { value: 'basic', label: 'Базовый (A1/A2)' },
              ]}
            />
          </FormItem>
        </>
      );
    case 'generic':
    default: // Handle old format or generic type
      return (
        <>
          <FormItem top="Название раздела">
            <Input
              value={section.title || ''}
              onChange={(e) => onChange(index, 'title', e.target.value)}
              placeholder="Например: Публикации, Хобби"
            />
          </FormItem>
          <FormItem top="Содержание">
            <Textarea
              value={section.content || ''}
              onChange={(e) => onChange(index, 'content', e.target.value)}
              placeholder="Опишите содержание этого раздела"
              rows={3}
              after={
                 <EnhanceButton
                   onClick={() => onEnhance(section.content, 'содержание раздела', 'customSection', index, 'content')}
                 />
              }
            />
          </FormItem>
        </>
      );
  }
};

SectionFields.propTypes = {
  section: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onEnhance: PropTypes.func.isRequired,
};


export const CustomSectionForm = ({
  customSections = [], // Default to empty array
  onCustomSectionChange,
  onAddCustomSection,
  onRemoveCustomSection,
  onMoveCustomSection,
  showTip, // Keep showTip if needed for general tips
  onEnhance
}) => {
  const platform = usePlatform(); // Get platform for ActionSheet styling
  const [activeActionSheet, setActiveActionSheet] = useState(null);
  const addSectionButtonRef = useRef(null);

  const openActionSheet = () => setActiveActionSheet('add-section');
  const closeActionSheet = () => setActiveActionSheet(null);

  const handleAddSection = (sectionType) => {
    onAddCustomSection(sectionType);
    closeActionSheet();
  };

  // Helper to get a title for the section card based on type
  const getSectionTitle = (section) => {
    switch (section.type) {
      case 'project': return section.title || 'Проект (без названия)';
      case 'certification': return section.name || 'Сертификат (без названия)';
      case 'language': return section.language || 'Язык (не указан)';
      case 'generic':
      default: return section.title || 'Дополнительный раздел';
    }
  };

  return (
    <FormItem top="Дополнительные разделы">
      {customSections.map((section, index) => (
        // Use section.id if available and unique, otherwise index
        <Card key={section.id || index} mode="shadow" style={{ marginBottom: 15, padding: 10, position: 'relative' }}>
          {/* Controls moved inside */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderBottom: '1px solid var(--vkui--color_separator_primary)', paddingBottom: 5 }}>
             <Div style={{ fontWeight: 'bold', padding: '0 12px 0 0' }}>{getSectionTitle(section)}</Div> {/* Display dynamic title */}
             <Div style={{ display: 'flex', alignItems: 'center', padding: 0 }}>
              <IconButton
                onClick={() => onMoveCustomSection(index, 'up')}
                disabled={index === 0}
                aria-label="Переместить вверх"
              >
                <Icon24ArrowUp />
              </IconButton>
              <IconButton
                onClick={() => onMoveCustomSection(index, 'down')}
                disabled={index === customSections.length - 1}
                aria-label="Переместить вниз"
              >
                <Icon24ArrowDownOutline />
              </IconButton>
              <IconButton
                onClick={() => onRemoveCustomSection(index)}
                aria-label="Удалить раздел"
              >
                <Icon24Cancel />
              </IconButton>
            </Div>
          </div>

          {/* Render fields based on type */}
          <SectionFields
            section={section}
            index={index}
            onChange={onCustomSectionChange}
            onEnhance={onEnhance}
          />

        </Card>
      ))}

      {/* Button to open ActionSheet */}
      <Button
        size="m"
        mode="secondary"
        before={<Icon24Add />}
        onClick={openActionSheet}
        getRootRef={addSectionButtonRef} // Attach ref
        stretched
      >
        Добавить раздел
      </Button>

      {/* ActionSheet for selecting section type */}
      {activeActionSheet === 'add-section' && (
        <ActionSheet
          onClose={closeActionSheet}
          iosCloseItem={platform === Platform.IOS && (
            <ActionSheetItem autoclose mode="cancel">
              Отменить
            </ActionSheetItem>
          )}
          // Use toggleRef for desktop popover positioning
          toggleRef={addSectionButtonRef.current}
        >
          <ActionSheetItem autoclose before={<Icon24ComputerOutline />} onClick={() => handleAddSection('project')}>
            Проекты
          </ActionSheetItem>
          <ActionSheetItem autoclose before={<Icon24Education />} onClick={() => handleAddSection('certification')}>
            Сертификаты/Курсы
          </ActionSheetItem>
          <ActionSheetItem autoclose before={<Icon24GlobeOutline />} onClick={() => handleAddSection('language')}>
            Языки
          </ActionSheetItem>
          <ActionSheetItem autoclose before={<Icon24ArticleOutline />} onClick={() => handleAddSection('generic')}>
            Другое (заголовок + текст)
          </ActionSheetItem>
          {platform !== Platform.IOS && (
             <ActionSheetItem autoclose mode="cancel">
               Отменить
             </ActionSheetItem>
           )}
        </ActionSheet>
      )}
    </FormItem>
  );
};

CustomSectionForm.propTypes = {
  customSections: PropTypes.arrayOf(PropTypes.object).isRequired, // Array of section objects
  onCustomSectionChange: PropTypes.func.isRequired,
  onAddCustomSection: PropTypes.func.isRequired,
  onRemoveCustomSection: PropTypes.func.isRequired,
  onMoveCustomSection: PropTypes.func.isRequired,
  showTip: PropTypes.func.isRequired,
  onEnhance: PropTypes.func.isRequired,
};