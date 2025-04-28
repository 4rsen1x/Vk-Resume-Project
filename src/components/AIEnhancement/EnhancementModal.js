import React, { useState, useEffect, useCallback } from 'react';
import { 
  ModalPage, 
  ModalPageHeader, 
  PanelHeaderButton, 
  Textarea, 
  FormItem, 
  Button, 
  Div, 
  Spinner, 
  Group,
  Header
} from '@vkontakte/vkui';
import { Icon24Dismiss, Icon24CheckCircleOutline, Icon24CancelCircleOutline } from '@vkontakte/icons';
import PropTypes from 'prop-types';

export const EnhancementModal = ({ 
  id, 
  onClose, 
  originalText, 
  fieldName, 
  onAccept 
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [enhancedText, setEnhancedText] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  
  // Initialize prompt when modal opens
  useEffect(() => {
    setCustomPrompt(`Enhance the following ${fieldName} text to make it more professional and impactful for a resume:`);
    setEnhancedText('');
    setLocalLoading(false);
    setLocalError(null);
  }, [fieldName, originalText]);

  const handleEnhance = useCallback(async () => {
    try {
      setLocalLoading(true);
      setLocalError(null);
      setEnhancedText('');
      
      const basePrompt = "Enhance the following text to make it more professional and impactful for a resume: ";
      const prompt = customPrompt || basePrompt;
      
      // Updated to use the backend API instead of directly calling OpenRouter
      const response = await fetch('http://localhost:3001/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          originalText,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.result) {
        setEnhancedText(data.result);
      }
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLocalLoading(false);
    }
  }, [customPrompt, originalText]);

  const handleAccept = () => {
    onAccept(enhancedText);
    onClose();
  };

  // Add a reset function to clear the enhanced text and allow generating a new response
  const handleReject = () => {
    setEnhancedText('');
    setLocalError(null);
  };

  return (
    <ModalPage
      id={id}
      header={
        <ModalPageHeader
          right={
            <PanelHeaderButton onClick={onClose}>
              <Icon24Dismiss />
            </PanelHeaderButton>
          }
        >
          Улучшить с помощью ИИ
        </ModalPageHeader>
      }
    >
      <Group>
        <FormItem top="Настройте запрос к ИИ">
          <Textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Введите запрос для ИИ"
            rows={3}
          />
        </FormItem>

        <FormItem top="Исходный текст">
          <Textarea
            value={originalText}
            disabled
            rows={3}
          />
        </FormItem>

        {!enhancedText && !localLoading && (
          <Div>
            <Button 
              size="l" 
              stretched 
              onClick={handleEnhance}
            >
              Улучшить текст
            </Button>
          </Div>
        )}

        {localLoading && (
          <Div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
            <Spinner />
          </Div>
        )}

        {localError && (
          <Div>
            <Header mode="secondary" style={{ color: 'var(--vkui--color_text_negative)' }}>
              Ошибка: {localError}
            </Header>
          </Div>
        )}

        {enhancedText && !localLoading && (
          <>
            <FormItem top="Улучшенный текст">
              <Textarea
                value={enhancedText}
                onChange={(e) => setEnhancedText(e.target.value)}
                rows={5}
              />
            </FormItem>
            
            <Div style={{ display: 'flex', gap: 8 }}>
              <Button 
                size="l" 
                stretched 
                mode="primary" 
                before={<Icon24CheckCircleOutline />}
                onClick={handleAccept}
              >
                Принять
              </Button>
              <Button 
                size="l" 
                stretched 
                mode="secondary" 
                before={<Icon24CancelCircleOutline />}
                onClick={handleReject}
              >
                Отклонить
              </Button>
            </Div>
          </>
        )}
      </Group>
    </ModalPage>
  );
};

EnhancementModal.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  originalText: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  onAccept: PropTypes.func.isRequired
};