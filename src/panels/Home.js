import React, { useState, useEffect } from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  Cell,
  Avatar,
  Button,
  Div,
  CardGrid,
  Card,
  Header,
  Text,
  IconButton,
  ModalRoot,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  Spinner,
  FormItem,
  Input,
  Snackbar,
  Placeholder // Import Placeholder
} from '@vkontakte/vkui';
import {
  Icon28AddOutline,
  Icon28EditOutline, // Keep for navigating to edit
  Icon28DeleteOutline,
  Icon56DocumentOutline, // Keep for placeholder
  Icon24Cancel,
  Icon28ArticleOutline // Use this for the resume list items
} from '@vkontakte/icons';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';
import { getUserResumes, deleteResume, updateResumeName } from '../utils/supabase'; // Assuming updateResumeName exists, but we might remove its usage here
import PropTypes from 'prop-types';

export const Home = ({ id, fetchedUser }) => {
  const routeNavigator = useRouteNavigator();
  const [userResumes, setUserResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Remove state related to the name editing modal
  // const [editingResume, setEditingResume] = useState(null);
  // const [editedName, setEditedName] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState(null);
  const [newResumeName, setNewResumeName] = useState('');

  useEffect(() => {
    async function loadUserResumes() {
      if (fetchedUser?.id) {
        setIsLoading(true);
        try {
          const resumes = await getUserResumes(fetchedUser.id);
          setUserResumes(resumes || []);
        } catch (error) {
          console.error('Ошибка при загрузке резюме:', error);
          showSnackbar('Не удалось загрузить список резюме');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false); // No user, no loading
        setUserResumes([]); // Ensure resumes are cleared if user logs out/changes
      }
    }
    loadUserResumes();
  }, [fetchedUser]); // Depend on fetchedUser

  const showSnackbar = (message) => {
    setSnackbar(<Snackbar onClose={() => setSnackbar(null)}>{message}</Snackbar>);
  };

  const handleCreateResume = () => {
    setNewResumeName(''); // Clear previous name
    setActiveModal('new-resume');
  };

  // Navigate to the Resume panel for editing
  const handleEditResume = (resumeId) => {
    console.log('Navigating to edit resume with ID:', resumeId);
    // Use path parameter format instead of query parameter
    routeNavigator.push(`/resume/${resumeId}`); // Change this line
  };

  // Remove functions related to the name editing modal
  // const startEditingName = (resume) => { ... };
  // const handleSaveResumeName = async () => { ... };

  // Function to handle creating the new resume entry (passes name via localStorage)
  const handleCreateNewResume = () => { // No async needed here
    if (!newResumeName.trim()) {
      showSnackbar('Пожалуйста, введите название резюме');
      return;
    }
    try {
      // Store the name in localStorage for the Resume component to pick up
      localStorage.setItem('newResumeName', newResumeName);
      // Navigate to the editor for a new resume (no ID in path)
      // This will now match the optional parameter route '/resume/:id?'
      routeNavigator.push('/resume');
      setActiveModal(null); // Close the modal
    } catch (error) {
      // This catch might not be necessary unless localStorage or navigation fails unexpectedly
      console.error('Error preparing for new resume:', error);
      showSnackbar('Произошла ошибка при переходе к созданию резюме');
    }
  };


  const confirmDeleteResume = (resumeId) => {
    setResumeToDelete(resumeId);
    setActiveModal('delete-confirm');
  };

  const handleDeleteResume = async () => {
    if (!resumeToDelete) return;
    try {
      await deleteResume(resumeToDelete);
      setUserResumes(prev => prev.filter(resume => resume.id !== resumeToDelete));
      showSnackbar('Резюме успешно удалено');
    } catch (error) {
      console.error('Ошибка при удалении резюме:', error);
      showSnackbar('Не удалось удалить резюме');
    } finally {
      setResumeToDelete(null);
      setActiveModal(null);
    }
  };

  const modal = (
    <ModalRoot activeModal={activeModal} onClose={() => setActiveModal(null)}>
      {/* --- New Resume Name Modal --- */}
      <ModalPage
        id="new-resume"
        header={
          <ModalPageHeader
            right={<PanelHeaderButton onClick={() => setActiveModal(null)}><Icon24Cancel /></PanelHeaderButton>}
          >
            Название нового резюме
          </ModalPageHeader>
        }
      >
        <FormItem top="Введите название для вашего нового резюме">
          <Input
            value={newResumeName}
            onChange={(e) => setNewResumeName(e.target.value)}
            placeholder="Например: Резюме Frontend разработчика"
          />
        </FormItem>
        <Div>
          <Button size="l" mode="primary" stretched onClick={handleCreateNewResume}>
            Создать резюме
          </Button>
        </Div>
      </ModalPage>

      {/* --- Delete Confirmation Modal --- */}
      <ModalPage
        id="delete-confirm"
        header={
          <ModalPageHeader
             right={<PanelHeaderButton onClick={() => setActiveModal(null)}><Icon24Cancel /></PanelHeaderButton>}
          >
            Подтверждение удаления
          </ModalPageHeader>
        }
      >
        <Div>
          <Text>Вы уверены, что хотите удалить это резюме? Это действие нельзя будет отменить.</Text>
        </Div>
        <Div style={{ display: 'flex', gap: '8px' }}>
          <Button size="l" mode="secondary" stretched onClick={() => setActiveModal(null)}>
            Отмена
          </Button>
          <Button size="l" mode="destructive" stretched onClick={handleDeleteResume}>
            Удалить
          </Button>
        </Div>
      </ModalPage>

      {/* Remove Edit Name Modal */}
      {/* <ModalPage id="edit-name"> ... </ModalPage> */}

    </ModalRoot>
  );

  return (
    <Panel id={id}>
      <PanelHeader>Мои Резюме</PanelHeader>
      {fetchedUser && (
        <Group>
           <Cell
            before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200} /> : null}
            subtitle={fetchedUser.city?.title || ''}
          >
            {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
          </Cell>
        </Group>
      )}

      <Group header={<Header mode="secondary">Ваши резюме</Header>}>
        <Div>
          <Button
            before={<Icon28AddOutline />}
            size="l"
            mode="primary"
            stretched
            onClick={handleCreateResume}
            disabled={isLoading} // Disable while loading resumes
          >
            Создать новое резюме
          </Button>
        </Div>

        {isLoading ? (
          <Spinner />
        ) : userResumes.length > 0 ? (
          <CardGrid size="l">
            {userResumes.map((resume) => (
              <Card key={resume.id} mode="shadow">
                {/* Use Cell for better structure and alignment */}
                <Cell
                  // Use a different icon for the list item itself
                  before={<Icon28ArticleOutline />}
                  // The main content of the cell is clickable to edit
                  onClick={() => handleEditResume(resume.id)}
                  // Add hover/active effects for better UX
                  hoverMode="background"
                  activeMode="background"
                  style={{ cursor: 'pointer' }} // Indicate clickability
                  subtitle={`Обновлено: ${new Date(resume.updated_at || resume.created_at).toLocaleDateString()}`} // Show last updated date
                  // Actions on the right
                  after={
                    <div style={{ display: 'flex' }}>
                      {/* Keep Edit Button - Navigates to full editor */}
                       <IconButton
                        aria-label="Редактировать резюме"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent Cell's onClick
                          handleEditResume(resume.id);
                        }}
                      >
                        <Icon28EditOutline />
                      </IconButton>
                      {/* Remove the second edit icon that opened the name modal */}
                      <IconButton
                        aria-label="Удалить резюме"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent Cell's onClick
                          confirmDeleteResume(resume.id);
                        }}
                        style={{ color: 'var(--vkui--color_icon_negative)' }} // Use destructive color hint
                      >
                        <Icon28DeleteOutline />
                      </IconButton>
                    </div>
                  }
                >
                  {/* Resume Name */}
                  <Text weight="1">{resume.name || 'Без названия'}</Text>
                </Cell>
              </Card>
            ))}
          </CardGrid>
        ) : (
          // Use Placeholder component for empty state
          <Placeholder
            icon={<Icon56DocumentOutline />}
            header="У вас пока нет резюме"
            action={
              <Button size="m" mode="primary" onClick={handleCreateResume}>
                Создать резюме
              </Button>
            }
          >
            Нажмите кнопку выше, чтобы создать ваше первое резюме.
          </Placeholder>
        )}
      </Group>

      {modal}
      {snackbar}
    </Panel>
  );
};

Home.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.object, // Make fetchedUser optional or ensure it's always passed
};
