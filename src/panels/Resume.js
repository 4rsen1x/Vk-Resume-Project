import { useState, useEffect, useRef, useCallback
 } from 'react';
import { 
  Panel, 
  PanelHeader, 
  PanelHeaderBack, 
  Group, 
  Tabs, 
  TabsItem, 
  Banner,
  Button,
  Snackbar,
  ModalRoot,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  FormItem,
  Input,
  Spinner,
  Div,
  Title
} from '@vkontakte/vkui';
import { useRouteNavigator, useParams } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { Icon24Download, Icon24DownloadCloudOutline, Icon24Cancel } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResumeEditor, ResumePreview } from '../components/Resume';
import { saveResume, getResumeById, updateResume } from '../utils/supabase';
import { debounce } from '../utils/helpers';

export const Resume = ({ id }) => {
  const resumeRef = useRef(null);
  const routeNavigator = useRouteNavigator();
  const params = useParams(); // Use the useParams hook

  // State to track the actual resume ID being worked on
  const [internalResumeId, setInternalResumeId] = useState(null);
  // State to track if the component is initializing (fetching initial URL param)
  const [isInitializing, setIsInitializing] = useState(true);

  const [activeTab, setActiveTab] = useState('edit');
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [snackbar, setSnackbar] = useState(null);
  // const [activeModal, setActiveModal] = useState(null); // Remove if modal is not used
  const [resumeName, setResumeName] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For data fetching
  const [isSaving, setIsSaving] = useState(false); // For save operation

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
    customSections: []
  });

  // Effect 1: Initialize internalResumeId from URL search parameter ONCE using useParams
  useEffect(() => {
    // Read the 'id' parameter provided by the router via useParams
    const idFromParams = params?.id;
    console.log('Initial ID from useParams:', idFromParams); // Log the ID obtained from params
    setInternalResumeId(idFromParams || null); // Set to null if undefined/falsy
    setIsInitializing(false); // Mark initialization complete
  }, [params]); // Depend on the params object

  // Effect 2: Consolidated data fetching logic based on internalResumeId
  useEffect(() => {
    // Don't run fetch logic until initialization is complete
    if (isInitializing) {
      return;
    }

    let isMounted = true;

    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch VK User Info only if it's potentially a new resume or data is missing
        // We might fetch it always and merge later if needed
        const vkUserPromise = bridge.send('VKWebAppGetUserInfo');

        if (internalResumeId) {
          // --- Fetch existing resume ---
          console.log('Fetching existing resume with ID:', internalResumeId);
          const resume = await getResumeById(internalResumeId);
          const vkUser = await vkUserPromise; // Wait for VK user data as well

          if (resume && isMounted) {
            console.log('Loaded resume data:', resume);
            // Merge fetched data with defaults and VK data
            const defaultData = {
              firstName: vkUser.first_name || '',
              lastName: vkUser.last_name || '',
              photo: vkUser.photo_200 || '',
              email: '',
              phone: '',
              position: 'Frontend Developer',
              education: [{ institution: '', degree: '', year: '' }],
              experience: [{ company: '', position: '', period: '', description: '' }],
              skills: ['React', 'JavaScript', 'HTML/CSS'],
              customSections: [],
              template: 'classic' // Default template string
            };
            const mergedData = { ...defaultData, ...(resume.data || {}) };

            // --- Ensure skills is always an array (existing fix) ---
            if (mergedData.skills && !Array.isArray(mergedData.skills)) {
              if (typeof mergedData.skills === 'string') {
                mergedData.skills = mergedData.skills.split(',')
                                      .map(skill => skill.trim())
                                      .filter(skill => skill);
              } else {
                console.warn('Fetched skills data was not an array or string, defaulting.');
                mergedData.skills = defaultData.skills;
              }
            } else if (!mergedData.skills) {
               mergedData.skills = defaultData.skills;
            }
            // --- End of skills check ---

            // --- Explicitly check template type before setting state ---
            let templateValue = defaultData.template; // Start with default string
            if (resume.data?.template) { // Check if template exists in fetched data
              if (typeof resume.data.template === 'string') {
                templateValue = resume.data.template; // Use fetched string if it's actually a string
              } else {
                // Log a warning if the fetched template is not a string
                console.warn(`Fetched template data was not a string (received type: ${typeof resume.data.template}), defaulting to '${defaultData.template}'. Value:`, resume.data.template);
                // Keep templateValue as the default string
              }
            }
            // --- End of template check ---

            setUserData(mergedData); // Set the potentially corrected merged data
            setResumeName(resume.name || 'Резюме'); // Use fetched name
            setSelectedTemplate(templateValue); // Set the validated template STRING state

          } else if (!resume && isMounted) {
             // Handle case where ID exists but resume not found (e.g., deleted)
             console.error('Resume not found for ID:', internalResumeId);
             showTip('Резюме не найдено. Возможно, оно было удалено.');
             // Optionally navigate back or reset state
             // routeNavigator.back();
             setInternalResumeId(null); // Treat as new
             setResumeName('Новое резюме');
             // Fetch VK user data for the new state
             const vkUser = await vkUserPromise;
             setUserData(prev => ({
                ...prev, // Keep any existing defaults
                firstName: vkUser.first_name || '',
                lastName: vkUser.last_name || '',
                photo: vkUser.photo_200 || ''
             }));
          }
        } else {
          // --- Setup for new resume ---
          console.log('Setting up for new resume');
          const savedName = localStorage.getItem('newResumeName');
          if (savedName && isMounted) {
            setResumeName(savedName);
            localStorage.removeItem('newResumeName');
          } else if (isMounted) {
            setResumeName('Новое резюме');
          }
          // Fetch VK user data and set defaults
          const vkUser = await vkUserPromise;
          if (isMounted) {
             setUserData(prev => ({
                ...prev, // Keep any existing defaults
                firstName: vkUser.first_name || '',
                lastName: vkUser.last_name || '',
                photo: vkUser.photo_200 || ''
             }));
          }
           // Reset other fields to default for a truly new resume
           setUserData(prev => ({
             ...prev,
             email: '',
             phone: '',
             position: 'Frontend Developer',
             education: [{ institution: '', degree: '', year: '' }],
             experience: [{ company: '', position: '', period: '', description: '' }],
             skills: ['React', 'JavaScript', 'HTML/CSS'],
             customSections: [],
             template: 'classic'
           }));
           setSelectedTemplate('classic');
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        if (isMounted) {
          showTip('Не удалось загрузить данные');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
    // Depend on internalResumeId and the initialization flag
  }, [internalResumeId, isInitializing]);

  // Remove the other redundant useEffect hooks that were fetching data
  // Modify handleInputChange to accept name and value directly
  const handleInputChange = (name, value) => {
  // const { name, value } = e.target; // Remove this line
  setUserData(prev => ({ ...prev, [name]: value }));
  // Note: We don't call save here anymore. Saving is manual.
  };
  
  // Modify handleEducationChange to accept name and value directly
  const handleEducationChange = (index, name, value) => {
  // const { name, value } = e.target; // Remove this line
  const updatedEducation = [...userData.education];
  // Ensure the education item at the index exists before trying to update it
  if (updatedEducation[index]) {
      updatedEducation[index] = { ...updatedEducation[index], [name]: value };
      setUserData(prev => ({ ...prev, education: updatedEducation }));
  } else {
      console.warn(`Attempted to update education at invalid index: ${index}`);
  }
  };

  const addEducation = () => {
    setUserData(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', year: '' }]
    }));
  };

  const removeEducation = (index) => {
    setUserData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedExperience = [...userData.experience];
    updatedExperience[index] = { ...updatedExperience[index], [name]: value };
    setUserData(prev => ({ ...prev, experience: updatedExperience }));
  };

  const addExperience = () => {
    setUserData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', period: '', description: '' }]
    }));
  };

  const removeExperience = (index) => {
    setUserData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleSkillsChange = (newSkills) => {
    setUserData(prev => ({ ...prev, skills: newSkills }));
  };

  const handleTemplateChange = (newTemplate) => {
    setSelectedTemplate(newTemplate);
    // Optionally save immediately when template changes, or rely on manual save
    // saveResumeData(); // Uncomment if you want template change to trigger save
  };

  const handleCustomSectionChange = (index, field, value) => {
    const updatedSections = [...userData.customSections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setUserData(prev => ({ ...prev, customSections: updatedSections }));
  };

  const addCustomSection = () => {
    setUserData(prev => ({
      ...prev,
      customSections: [...prev.customSections, { title: 'Новый раздел', content: '' }]
    }));
  };

  const removeCustomSection = (index) => {
    setUserData(prev => ({
      ...prev,
      customSections: prev.customSections.filter((_, i) => i !== index)
    }));
  };

  const moveCustomSection = (index, direction) => {
    const updatedSections = [...userData.customSections];
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < updatedSections.length) {
      [updatedSections[index], updatedSections[newIndex]] = [updatedSections[newIndex], updatedSections[index]]; // Swap elements
      setUserData(prev => ({ ...prev, customSections: updatedSections }));
    }
  };

  const downloadResume = async () => {
    if (!resumeRef.current) return;
    showTip('Начинаем генерацию PDF...');
    try {
      // Ensure background is white for canvas capture
      resumeRef.current.style.backgroundColor = '#ffffff';
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2, // Increase scale for better resolution
        useCORS: true, // Important if images are from external sources (like VK photos)
        backgroundColor: '#ffffff', // Explicitly set background
        logging: true, // Enable logging for debugging
        onclone: (clonedDoc) => {
          // Optional: Apply styles specifically for PDF generation within the cloned document if needed
          const clonedResumeElement = clonedDoc.querySelector('.resume-preview-container'); // Adjust selector if needed
          if (clonedResumeElement) {
             clonedResumeElement.style.margin = '0';
             clonedResumeElement.style.boxShadow = 'none';
          }
        }
      });
      resumeRef.current.style.backgroundColor = ''; // Reset background

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt', // Use points for dimensions
        format: 'a4' // Standard A4 size
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate the aspect ratio to fit the image onto the A4 page
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgScaledWidth = imgWidth * ratio;
      const imgScaledHeight = imgHeight * ratio;

      // Center the image on the page (optional)
      const xPos = (pdfWidth - imgScaledWidth) / 2;
      const yPos = (pdfHeight - imgScaledHeight) / 2; // Or set to 0 to start from top

      pdf.addImage(imgData, 'PNG', xPos, yPos, imgScaledWidth, imgScaledHeight);
      pdf.save(`${resumeName || 'resume'}.pdf`);
      showTip('PDF успешно сгенерирован!');
    } catch (error) {
      console.error('Ошибка при генерации PDF:', error);
      showTip('Не удалось сгенерировать PDF. Проверьте консоль.');
    }
  };


  // Debounced save function using internalResumeId
  const debouncedSave = useCallback(
    debounce(async () => {
      if (!resumeName.trim()) {
        showTip('Пожалуйста, введите название резюме');
        return; // Don't save if no name is set
      }
      if (isSaving) return; // Prevent concurrent saves

      setIsSaving(true);
      try {
        const user = await bridge.send('VKWebAppGetUserInfo'); // Ensure we have user ID for saving

        // Prepare data payload, ensuring template is included
        const dataToSave = { ...userData, template: selectedTemplate };

        if (internalResumeId) { // Use the state variable here
          // Update existing resume
          console.log('Attempting to update resume with ID:', internalResumeId);
          await updateResume(internalResumeId, dataToSave, resumeName);
          console.log('Resume updated with ID:', internalResumeId);
          showTip('Резюме обновлено');
        } else {
          // Create new resume
          console.log('Attempting to create new resume');
          const newResumeData = await saveResume(user.id, dataToSave, resumeName);
          if (newResumeData && newResumeData.length > 0) {
            const newResumeId = newResumeData[0].id;
            console.log('New resume created with ID:', newResumeId);

            // Update URL *and* internal state
            window.history.replaceState(null, '', `/resume?id=${newResumeId}`);
            setInternalResumeId(newResumeId); // <-- Update the state ID

            showTip('Новое резюме создано');
          } else {
             throw new Error("Failed to create resume or get ID back from saveResume");
          }
        }
      } catch (error) {
        console.error('Error saving resume:', error);
        showTip('Произошла ошибка при сохранении');
      } finally {
        setIsSaving(false);
      }
    }, 1000), // Adjust debounce timing as needed
    // Dependencies: internalResumeId, userData, resumeName, selectedTemplate, isSaving
    [internalResumeId, userData, resumeName, selectedTemplate, isSaving]
  );

  // ... other handlers (handleInputChange, addEducation, etc.) should NOT call debouncedSave() directly ...
  // ... they just update state ...

  const showTip = (tip) => {
    setSnackbar(
      <Snackbar
        onClose={() => setSnackbar(null)}
      >
        {tip}
      </Snackbar>
    );
  };

  // ... handlers for custom sections, download, etc. ...

  // Manual save function triggered by the button or onBlur
  const saveResumeData = () => {
    console.log('Manual save triggered for resume ID:', internalResumeId);
    // Basic validation before calling debounce
    if (!resumeName.trim()) {
       showTip('Пожалуйста, введите название резюме');
       return;
    }
    debouncedSave(); // Call the debounced save logic
  };

  // Render logic
  // Add console log here to check the value just before rendering ResumeEditor
  console.log('Rendering Resume panel. selectedTemplate:', selectedTemplate, 'Type:', typeof selectedTemplate);

  return (
    <Panel id={id}>
      <PanelHeader
        before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}
      >
        {/* Title depends on loading state and internalResumeId */}
        {isLoading || isInitializing ? 'Загрузка...' : (internalResumeId ? `Редактирование: ${resumeName}` : 'Новое резюме')}
      </PanelHeader>

      {/* Keep the Title and Save button section */}
       <Div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        marginBottom: 8,
        // Add a border or background for visual separation if needed
        // borderBottom: '1px solid var(--vkui--color_separator_primary)'
      }}>
         {/* Use Input for editable name, triggering save on blur */}
         <FormItem top="Название резюме" style={{ flexGrow: 1, marginRight: 16, marginBottom: 0 }}>
           <Input
             value={resumeName}
             onChange={(e) => setResumeName(e.target.value)}
             onBlur={saveResumeData} // Save when focus leaves the name input
             placeholder="Введите название резюме"
             disabled={isLoading || isSaving || isInitializing} // Disable during loading/saving/init
           />
         </FormItem>
        <Button
          before={isSaving ? <Spinner/> : <Icon24DownloadCloudOutline />}
          mode="primary"
          size="m"
          onClick={saveResumeData}
          disabled={isSaving || isLoading || !resumeName.trim() || isInitializing} // Disable while saving, loading, or if name is empty or initializing
        >
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </Div>

      <Tabs>
        {/* ... TabsItems ... */}
         <TabsItem selected={activeTab === 'edit'} onClick={() => setActiveTab('edit')}>
          Редактирование
        </TabsItem>
        <TabsItem selected={activeTab === 'preview'} onClick={() => setActiveTab('preview')}>
          Предпросмотр
        </TabsItem>
      </Tabs>

      {/* ... Banner ... */}
       <Banner
        header="Советы по составлению резюме"
        subheader="Посмотрите вебинары от VK Education о том, как создать эффективное резюме"
        actions={
          <Button size="m" mode="primary" onClick={() => bridge.send('VKWebAppOpenApp', { app_id: 6232540 })}>
            Смотреть вебинары
          </Button>
        }
      />

      {isLoading || isInitializing ? (
        <Group>
          <Div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
            <Spinner/>
          </Div>
        </Group>
      ) : activeTab === 'edit' ? (
        <ResumeEditor
          userData={userData}
          selectedTemplate={selectedTemplate} // Prop being passed
          onInputChange={handleInputChange}
          onEducationChange={handleEducationChange} // Now defined
          onExperienceChange={handleExperienceChange} // Now defined
          onSkillsChange={handleSkillsChange} // Now defined
          onTemplateChange={handleTemplateChange} // Now defined
          onAddEducation={addEducation} // Now defined
          onAddExperience={addExperience} // Now defined
          onRemoveEducation={removeEducation} // Now defined
          onRemoveExperience={removeExperience} // Now defined
          onCustomSectionChange={handleCustomSectionChange} // Corrected typo and now defined
          onAddCustomSection={addCustomSection} // Now defined
          onRemoveCustomSection={removeCustomSection} // Now defined
          onMoveCustomSection={moveCustomSection} // Now defined
          showTip={showTip}
          onSave={saveResumeData} // Pass the manual save function
        />
      ) : (
        <ResumePreview
          userData={userData}
          selectedTemplate={selectedTemplate} // Prop being passed
          resumeRef={resumeRef}
          onDownloadResume={downloadResume} // Now defined
        />
      )}

      {/* Remove modal if not used */}
      {/* {modal} */}
      {snackbar}
    </Panel>
  );
};

Resume.propTypes = {
  id: PropTypes.string.isRequired, // Panel ID from router
};
