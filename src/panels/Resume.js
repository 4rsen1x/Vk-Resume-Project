import { useState, useEffect, useRef } from 'react';
import { 
  Panel, 
  PanelHeader, 
  PanelHeaderBack, 
  Group, 
  Tabs, 
  TabsItem, 
  Banner,
  Button,
  Snackbar
} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { Icon24Download } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResumeEditor, ResumePreview } from '../components/Resume';

export const Resume = ({ id }) => {
  const resumeRef = useRef(null);
  const routeNavigator = useRouteNavigator();
  const [activeTab, setActiveTab] = useState('edit');
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [snackbar, setSnackbar] = useState(null);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    photo: '',
    email: '',
    phone: '',
    position: 'Frontend Developer',
    education: [{ institution: '', degree: '', year: '' }],
    experience: [{ company: '', position: '', period: '', description: '' }],
    skills: ['React', 'JavaScript', 'HTML/CSS'],
    customSections: [] // Add empty array for custom sections
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = await bridge.send('VKWebAppGetUserInfo');
        setUserData(prev => ({
          ...prev,
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          photo: user.photo_200 || ''
        }));
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
      }
    }
    fetchUserData();
  }, []);

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...userData.education];
    newEducation[index][field] = value;
    setUserData(prev => ({
      ...prev,
      education: newEducation
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...userData.experience];
    newExperience[index][field] = value;
    setUserData(prev => ({
      ...prev,
      experience: newExperience
    }));
  };

  const addEducation = () => {
    setUserData(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', year: '' }]
    }));
  };

  const addExperience = () => {
    setUserData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', period: '', description: '' }]
    }));
  };

  const removeEducation = (index) => {
    if (userData.education.length > 1) {
      const newEducation = [...userData.education];
      newEducation.splice(index, 1);
      setUserData(prev => ({
        ...prev,
        education: newEducation
      }));
    } else {
      showTip('Необходимо иметь хотя бы одно образование');
    }
  };

  const removeExperience = (index) => {
    if (userData.experience.length > 1) {
      const newExperience = [...userData.experience];
      newExperience.splice(index, 1);
      setUserData(prev => ({
        ...prev,
        experience: newExperience
      }));
    } else {
      showTip('Необходимо иметь хотя бы один опыт работы');
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setUserData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleTemplateChange = (e) => {
    setSelectedTemplate(e.target.value);
  };

  const downloadResume = async (format) => {
    if (!resumeRef.current) {
      showTip('Не удалось найти шаблон резюме');
      return;
    }

    try {
      if (format === 'PDF') {
        const canvas = await html2canvas(resumeRef.current, {
          scale: 2,
          useCORS: true,
          logging: false
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10;
        
        pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`${userData.firstName}_${userData.lastName}_resume.pdf`);
      } else if (format === 'DOCX') {
        showTip('Функция скачивания в DOCX будет доступна в ближайшее время');
        return;
      }
      
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(null)}
          before={<Icon24Download />}
        >
          Резюме скачано в формате {format}
        </Snackbar>
      );
    } catch (error) {
      console.error('Ошибка при скачивании резюме:', error);
      showTip('Произошла ошибка при скачивании резюме');
    }
  };

  const showTip = (tip) => {
    setSnackbar(
      <Snackbar
        onClose={() => setSnackbar(null)}
      >
        {tip}
      </Snackbar>
    );
  };

  // Add handlers for custom sections
  const handleCustomSectionChange = (index, field, value) => {
    const newCustomSections = [...userData.customSections];
    newCustomSections[index][field] = value;
    setUserData(prev => ({
      ...prev,
      customSections: newCustomSections
    }));
  };

  const addCustomSection = () => {
    setUserData(prev => ({
      ...prev,
      customSections: [...prev.customSections, { title: 'Новый раздел', content: '' }]
    }));
  };

  const removeCustomSection = (index) => {
    const newCustomSections = [...userData.customSections];
    newCustomSections.splice(index, 1);
    setUserData(prev => ({
      ...prev,
      customSections: newCustomSections
    }));
  };

  const moveCustomSection = (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === userData.customSections.length - 1)
    ) {
      return;
    }

    const newCustomSections = [...userData.customSections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap sections
    [newCustomSections[index], newCustomSections[newIndex]] = 
    [newCustomSections[newIndex], newCustomSections[index]];
    
    setUserData(prev => ({
      ...prev,
      customSections: newCustomSections
    }));
  };

  return (
    <Panel id={id}>
      <PanelHeader
        before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}
      >
        Резюме
      </PanelHeader>
      
      <Tabs>
        <TabsItem
          selected={activeTab === 'edit'}
          onClick={() => setActiveTab('edit')}
        >
          Редактирование
        </TabsItem>
        <TabsItem
          selected={activeTab === 'preview'}
          onClick={() => setActiveTab('preview')}
        >
          Предпросмотр
        </TabsItem>
      </Tabs>
      
      <Banner
        header="Советы по составлению резюме"
        subheader="Посмотрите вебинары от VK Education о том, как создать эффективное резюме"
        actions={
          <Button size="m" mode="primary" onClick={() => bridge.send('VKWebAppOpenApp', { app_id: 6232540 })}>
            Смотреть вебинары
          </Button>
        }
      />
      
      {activeTab === 'edit' ? (
        <ResumeEditor 
          userData={userData}
          selectedTemplate={selectedTemplate}
          onInputChange={handleInputChange}
          onEducationChange={handleEducationChange}
          onExperienceChange={handleExperienceChange}
          onSkillsChange={handleSkillsChange}
          onTemplateChange={handleTemplateChange}
          onAddEducation={addEducation}
          onAddExperience={addExperience}
          onRemoveEducation={removeEducation}
          onRemoveExperience={removeExperience}
          onCustomSectionChange={handleCustomSectionChange}
          onAddCustomSection={addCustomSection}
          onRemoveCustomSection={removeCustomSection}
          onMoveCustomSection={moveCustomSection}
          showTip={showTip}
        />
      ) : (
        <ResumePreview 
          userData={userData}
          selectedTemplate={selectedTemplate}
          resumeRef={resumeRef}
          onDownloadResume={downloadResume}
        />
      )}
      
      {snackbar}
    </Panel>
  );
};

Resume.propTypes = {
  id: PropTypes.string.isRequired,
};