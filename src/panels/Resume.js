import { useState, useEffect, useRef } from 'react';
import { 
  Panel, 
  PanelHeader, 
  PanelHeaderBack, 
  Group, 
  FormItem, 
  Input, 
  Textarea, 
  Avatar, 
  Button, 
  Select, 
  Div, 
  Card, 
  Tabs, 
  TabsItem, 
  File,
  Banner,
  Snackbar,
  IconButton
} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { Icon24Camera, Icon24Document, Icon24Download, Icon24Cancel } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const Resume = ({ id }) => {
  // Add a ref for the resume template
  const resumeRef = useRef(null);
  
  // Rest of your state variables remain the same
  const routeNavigator = useRouteNavigator();
  const [activeTab, setActiveTab] = useState('edit');
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [snackbar, setSnackbar] = useState(null);
  const [userData, setUserData] = useState({
    // Your existing userData state
    firstName: '',
    lastName: '',
    photo: '',
    email: '',
    phone: '',
    position: 'Frontend Developer',
    education: [{ institution: '', degree: '', year: '' }],
    experience: [{ company: '', position: '', period: '', description: '' }],
    skills: ['React', 'JavaScript', 'HTML/CSS']
  });

  // Your existing functions remain the same
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

  // Add functions to remove education and experience items
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

  // Add this function to handle template changes
  const handleTemplateChange = (e) => {
    setSelectedTemplate(e.target.value);
  };

  // Update the download function to actually generate and download files
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
        // For DOCX, we'll just show a message for now
        // In a real app, you would use a library like docx.js
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

  const renderEditForm = () => (
    <Group>
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

        {/* Rest of your form items remain the same */}
        <FormItem top="Имя">
          <Input
            value={userData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
          />
        </FormItem>

        <FormItem top="Фамилия">
          <Input
            value={userData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
          />
        </FormItem>

        {/* Other personal info fields remain the same */}
      </Group>

      {/* Template selection remains the same */}
      <Group>
        <FormItem top="Шаблон резюме">
          <Select
            value={selectedTemplate}
            onChange={handleTemplateChange}
            options={[
              { value: 'classic', label: 'Классический' },
              { value: 'modern', label: 'Современный' },
              { value: 'creative', label: 'Креативный' }
            ]}
          />
        </FormItem>
      </Group>

      {/* Skills section remains the same */}
      <Group>
        <FormItem top="Навыки (через запятую)">
          <Textarea
            value={userData.skills.join(', ')}
            onChange={handleSkillsChange}
            placeholder="React, JavaScript, HTML/CSS"
            after={
              <Button
                mode="tertiary"
                onClick={() => showTip('Укажите ключевые навыки, которые важны для вашей профессии')}
              >
                ?
              </Button>
            }
          />
        </FormItem>
      </Group>

      {/* Update education section to include remove buttons */}
      <Group>
        <FormItem top="Образование">
          {userData.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: 15, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                <IconButton 
                  onClick={() => removeEducation(index)}
                  aria-label="Удалить образование"
                >
                  <Icon24Cancel />
                </IconButton>
              </div>
              <FormItem top="Учебное заведение">
                <Input
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  placeholder="Название университета/колледжа"
                />
              </FormItem>
              <FormItem top="Степень/Специальность">
                <Input
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  placeholder="Бакалавр информатики"
                />
              </FormItem>
              <FormItem top="Годы обучения">
                <Input
                  value={edu.year}
                  onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                  placeholder="2016-2020"
                />
              </FormItem>
            </div>
          ))}
          <Button size="m" mode="secondary" onClick={addEducation}>
            Добавить образование
          </Button>
        </FormItem>
      </Group>

      {/* Update experience section to include remove buttons */}
      <Group>
        <FormItem top="Опыт работы">
          {userData.experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: 15, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                <IconButton 
                  onClick={() => removeExperience(index)}
                  aria-label="Удалить опыт работы"
                >
                  <Icon24Cancel />
                </IconButton>
              </div>
              <FormItem top="Компания">
                <Input
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  placeholder="Название компании"
                />
              </FormItem>
              <FormItem top="Должность">
                <Input
                  value={exp.position}
                  onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                  placeholder="Frontend Developer"
                />
              </FormItem>
              <FormItem top="Период работы">
                <Input
                  value={exp.period}
                  onChange={(e) => handleExperienceChange(index, 'period', e.target.value)}
                  placeholder="2020 - настоящее время"
                />
              </FormItem>
              <FormItem top="Описание обязанностей">
                <Textarea
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
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
          <Button size="m" mode="secondary" onClick={addExperience}>
            Добавить опыт работы
          </Button>
        </FormItem>
      </Group>
    </Group>
  );

  const renderPreview = () => {
    const templates = {
      classic: (
        <Card mode="shadow" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            {userData.photo && <Avatar size={100} src={userData.photo} style={{ marginRight: 20 }} />}
            <div>
              <h2 style={{ margin: 0 }}>{userData.firstName} {userData.lastName}</h2>
              <h3 style={{ margin: '5px 0', fontWeight: 'normal' }}>{userData.position}</h3>
            </div>
          </div>
          
          <div style={{ marginBottom: 20 }}>
            {userData.email && <div>{userData.email}</div>}
            {userData.phone && <div>{userData.phone}</div>}
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: 5 }}>Навыки</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {userData.skills.map((skill, index) => (
                <div key={index} style={{ margin: '5px 10px 5px 0' }}>
                  • {skill}
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: 5 }}>Опыт работы</h3>
            {userData.experience.map((exp, index) => (
              <div key={index} style={{ marginBottom: 15 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: 0 }}>{exp.position}</h4>
                  <div>{exp.period}</div>
                </div>
                <div style={{ fontWeight: 'bold' }}>{exp.company}</div>
                <div>{exp.description}</div>
              </div>
            ))}
          </div>
          
          <div>
            <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: 5 }}>Образование</h3>
            {userData.education.map((edu, index) => (
              <div key={index} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: 0 }}>{edu.institution}</h4>
                  <div>{edu.year}</div>
                </div>
                <div>{edu.degree}</div>
              </div>
            ))}
          </div>
        </Card>
      ),
      modern: (
        <Card mode="shadow" style={{ padding: 20, background: '#f5f5f5' }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            {userData.photo && <Avatar size={120} src={userData.photo} style={{ margin: '0 auto 15px' }} />}
            <h1 style={{ margin: '0 0 5px', fontSize: 28 }}>{userData.firstName} {userData.lastName}</h1>
            <h2 style={{ margin: 0, fontWeight: 'normal', color: '#2688eb' }}>{userData.position}</h2>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            {userData.email && <div style={{ margin: '0 10px' }}>{userData.email}</div>}
            {userData.phone && <div style={{ margin: '0 10px' }}>{userData.phone}</div>}
          </div>
          
          <div style={{ marginBottom: 30 }}>
            <h3 style={{ color: '#2688eb', textAlign: 'center' }}>Навыки</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {userData.skills.map((skill, index) => (
                <div key={index} style={{ 
                  background: '#fff', 
                  padding: '5px 15px', 
                  margin: 5, 
                  borderRadius: 15,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  {skill}
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom: 30 }}>
            <h3 style={{ color: '#2688eb', textAlign: 'center' }}>Опыт работы</h3>
            {userData.experience.map((exp, index) => (
              <div key={index} style={{ 
                background: '#fff', 
                padding: 15, 
                marginBottom: 15, 
                borderRadius: 10,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: 0 }}>{exp.position}</h4>
                  <div style={{ color: '#818c99' }}>{exp.period}</div>
                </div>
                <div style={{ fontWeight: 'bold', marginBottom: 10 }}>{exp.company}</div>
                <div>{exp.description}</div>
              </div>
            ))}
          </div>
          
          <div>
            <h3 style={{ color: '#2688eb', textAlign: 'center' }}>Образование</h3>
            {userData.education.map((edu, index) => (
              <div key={index} style={{ 
                background: '#fff', 
                padding: 15, 
                marginBottom: 15, 
                borderRadius: 10,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h4 style={{ margin: 0 }}>{edu.institution}</h4>
                <div>{edu.degree}</div>
                <div style={{ color: '#818c99' }}>{edu.year}</div>
              </div>
            ))}
          </div>
        </Card>
      ),
      creative: (
        <Card mode="shadow" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #4a76a8 0%, #2688eb 100%)', 
            color: 'white',
            padding: 30
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {userData.photo && <Avatar size={100} src={userData.photo} style={{ marginRight: 20, border: '3px solid white' }} />}
              <div>
                <h1 style={{ margin: 0, fontSize: 32 }}>{userData.firstName} {userData.lastName}</h1>
                <h2 style={{ margin: '5px 0', fontWeight: 'normal' }}>{userData.position}</h2>
              </div>
            </div>
            
            <div style={{ marginTop: 20 }}>
              {userData.email && <div style={{ margin: '5px 0' }}>📧 {userData.email}</div>}
              {userData.phone && <div style={{ margin: '5px 0' }}>📱 {userData.phone}</div>}
            </div>
          </div>
          
          <div style={{ padding: 20 }}>
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ 
                position: 'relative', 
                paddingBottom: 10,
                marginBottom: 15
              }}>
                <span style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  width: 50, 
                  height: 3, 
                  background: '#4a76a8' 
                }}></span>
                Навыки
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {userData.skills.map((skill, index) => (
                  <div key={index} style={{ 
                    background: '#f5f5f5', 
                    padding: '8px 15px', 
                    margin: '0 10px 10px 0', 
                    borderRadius: 5
                  }}>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ 
                position: 'relative', 
                paddingBottom: 10,
                marginBottom: 15
              }}>
                <span style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  width: 50, 
                  height: 3, 
                  background: '#4a76a8' 
                }}></span>
                Опыт работы
              </h3>
              {userData.experience.map((exp, index) => (
                <div key={index} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h4 style={{ margin: 0, color: '#4a76a8' }}>{exp.position}</h4>
                    <div style={{ color: '#818c99', fontSize: 14 }}>{exp.period}</div>
                  </div>
                  <div style={{ fontWeight: 'bold', marginBottom: 5 }}>{exp.company}</div>
                  <div>{exp.description}</div>
                </div>
              ))}
            </div>
            
            <div>
              <h3 style={{ 
                position: 'relative', 
                paddingBottom: 10,
                marginBottom: 15
              }}>
                <span style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  width: 50, 
                  height: 3, 
                  background: '#4a76a8' 
                }}></span>
                Образование
              </h3>
              {userData.education.map((edu, index) => (
                <div key={index} style={{ marginBottom: 15 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h4 style={{ margin: 0, color: '#4a76a8' }}>{edu.institution}</h4>
                    <div style={{ color: '#818c99', fontSize: 14 }}>{edu.year}</div>
                  </div>
                  <div>{edu.degree}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )
    };

    // Добавим отладочный вывод для проверки выбранного шаблона
    console.log('Selected template:', selectedTemplate);

    return (
      <div>
        <Div>
          <Button 
            before={<Icon24Document />} 
            size="m" 
            mode="primary" 
            onClick={() => downloadResume('PDF')}
            stretched
          >
            Скачать PDF
          </Button>
        </Div>
        <Div>
          <div ref={resumeRef}>
            {templates[selectedTemplate]}
          </div>
        </Div>
      </div>
    );
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
      
      {activeTab === 'edit' ? renderEditForm() : renderPreview()}
      
      {snackbar}
    </Panel>
  );
};

Resume.propTypes = {
  id: PropTypes.string.isRequired,
};