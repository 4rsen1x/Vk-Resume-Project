import React from 'react';
import { 
  FormItem, 
  Input, 
  Textarea, 
  Button, 
  IconButton,
  Div,
  Card
} from '@vkontakte/vkui';
import { 
  Icon24Cancel, 
  Icon24ArrowUp, 
  Icon24ArrowDownOutline, 
  Icon24Add
} from '@vkontakte/icons';
import PropTypes from 'prop-types';

export const CustomSectionForm = ({ 
  customSections, 
  onCustomSectionChange, 
  onAddCustomSection, 
  onRemoveCustomSection, 
  onMoveCustomSection,
  showTip 
}) => {
  return (
    <FormItem top="Дополнительные разделы">
      {customSections.map((section, index) => (
        <Card key={index} mode="shadow" style={{ marginBottom: 15, padding: 10, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <FormItem top="Название раздела" style={{ flex: 1, marginRight: 10 }}>
              <Input
                value={section.title}
                onChange={(e) => onCustomSectionChange(index, 'title', e.target.value)}
                placeholder="Например: Проекты, Публикации, Хобби"
              />
            </FormItem>
            <Div style={{ display: 'flex', alignItems: 'center' }}>
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
          <FormItem top="Содержание">
            <Textarea
              value={section.content}
              onChange={(e) => onCustomSectionChange(index, 'content', e.target.value)}
              placeholder="Опишите содержание этого раздела"
              rows={3}
              after={
                <Button
                  mode="tertiary"
                  onClick={() => showTip('Добавьте информацию, которая дополнит ваше резюме')}
                >
                  ?
                </Button>
              }
            />
          </FormItem>
        </Card>
      ))}
      <Button 
        size="m" 
        mode="secondary" 
        onClick={onAddCustomSection}
        before={<Icon24Add />}
      >
        Добавить новый раздел
      </Button>
    </FormItem>
  );
};

CustomSectionForm.propTypes = {
  customSections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.string
    })
  ).isRequired,
  onCustomSectionChange: PropTypes.func.isRequired,
  onAddCustomSection: PropTypes.func.isRequired,
  onRemoveCustomSection: PropTypes.func.isRequired,
  onMoveCustomSection: PropTypes.func.isRequired,
  showTip: PropTypes.func.isRequired
};