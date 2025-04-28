import React, { useState, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Div, Button } from '@vkontakte/vkui';
import { ResumeTemplates } from './ResumeTemplates';

export const ResumePreview = forwardRef(({ userData, selectedTemplate, onDownloadResume }, ref) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRefReady, setIsRefReady] = useState(false);

  useEffect(() => {
    if (ref && ref.current) {
      setIsRefReady(true);
    }
  }, [ref]);

  if (!userData) {
    return <Div>Загрузка данных...</Div>;
  }

  const handleDownload = async () => {
    if (!isRefReady) {
      console.error('Resume ref not ready for download');
      return;
    }
    
    setIsDownloading(true);
    try {
      await onDownloadResume();
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Div>
      <Div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
        <Button 
          size="l" 
          onClick={handleDownload}
          loading={isDownloading}
          disabled={isDownloading || !isRefReady}
        >
          {isDownloading ? 'Генерация PDF...' : 'Скачать PDF'}
        </Button>
      </Div>
      <div id="resume-preview-content" ref={ref}>
        <ResumeTemplates userData={userData} selectedTemplate={selectedTemplate} />
      </div>
    </Div>
  );
});

ResumePreview.displayName = 'ResumePreview';

ResumePreview.propTypes = {
  userData: PropTypes.object,
  selectedTemplate: PropTypes.string.isRequired,
  onDownloadResume: PropTypes.func.isRequired,
};

ResumePreview.defaultProps = {
  userData: {},
};