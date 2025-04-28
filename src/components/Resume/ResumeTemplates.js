import React from 'react';
import { Card, Avatar } from '@vkontakte/vkui';
import PropTypes from 'prop-types';
// Consider adding icons if needed for Creative template
// import { Icon24MailOutline, Icon24PhoneOutline } from '@vkontakte/icons';

// --- Color Palette (Keep for consistency) ---
const TEXT_COLOR = '#333333'; // Slightly softer than pure black
const HEADING_COLOR_DARK = '#111111'; // Very dark gray for main headings
const SUBHEADING_COLOR = '#555555'; // For secondary info like dates, company names
const LINK_COLOR = '#0056b3'; // A standard accessible blue
const BORDER_COLOR = '#e0e0e0'; // Light gray for borders/separators
const ACCENT_BLUE = '#007bff'; // Refined blue for Modern
const ACCENT_TEAL = '#17a2b8'; // A professional teal for Creative

// --- Helper function to render custom sections ---
// Updated styles within the helper for better consistency
const renderCustomSection = (section, index, templateStyle = 'classic') => {
  const sectionStyle = { marginBottom: 25 }; // Consistent bottom margin
  const paragraphStyle = { margin: '0 0 8px 0', color: TEXT_COLOR, fontSize: '14px', lineHeight: '1.6' };
  const strongStyle = { color: HEADING_COLOR_DARK }; // Darker labels

  let titleStyle = {
    fontSize: '16px',
    fontWeight: '600', // Semi-bold
    color: HEADING_COLOR_DARK,
    marginBottom: 12,
    paddingBottom: 5,
    borderBottom: `1px solid ${BORDER_COLOR}`, // Default border
  };
  let contentWrapperStyle = { whiteSpace: 'pre-line', color: TEXT_COLOR, fontSize: '14px', lineHeight: '1.6' };

  // Template-specific overrides
  if (templateStyle === 'modern') {
    titleStyle = {
      ...titleStyle,
      color: ACCENT_BLUE, // Modern accent color
      borderBottom: `2px solid ${ACCENT_BLUE}`,
      textAlign: 'left', // Align left in modern
    };
    contentWrapperStyle = {
      ...contentWrapperStyle,
      background: '#ffffff', // White background for modern content blocks
      padding: 15,
      borderRadius: 5,
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      marginTop: 8,
    };
  } else if (templateStyle === 'creative') {
     titleStyle = {
       ...titleStyle,
       color: ACCENT_TEAL, // Creative accent color
       borderBottom: `2px solid ${ACCENT_TEAL}`,
       textTransform: 'uppercase', // Uppercase titles for creative
       letterSpacing: '0.5px',
       fontSize: '15px', // Slightly smaller uppercase title
     };
     contentWrapperStyle = {
       ...contentWrapperStyle,
       paddingLeft: 15, // Indent content slightly
       borderLeft: `3px solid ${BORDER_COLOR}`, // Add a subtle left border
       marginTop: 8,
     };
  }

  switch (section.type) {
    case 'project':
      return (
        <div key={section.id || index} style={sectionStyle}>
          <h4 style={titleStyle}>{section.title || 'Проект'}</h4> {/* Use h4 for semantic section headings */}
          <div style={contentWrapperStyle}>
            {section.description && <p style={paragraphStyle}>{section.description}</p>}
            {section.technologies && <p style={paragraphStyle}><strong style={strongStyle}>Технологии:</strong> {section.technologies}</p>}
            {section.link && <p style={{ ...paragraphStyle, margin: 0 }}><strong style={strongStyle}>Ссылка:</strong> <a href={section.link} target="_blank" rel="noopener noreferrer" style={{ color: LINK_COLOR }}>{section.link}</a></p>}
          </div>
        </div>
      );
    case 'certification':
       return (
         <div key={section.id || index} style={sectionStyle}>
           <h4 style={titleStyle}>{section.name || 'Сертификат/Курс'}</h4> {/* Use h4 */}
           <div style={contentWrapperStyle}>
             {section.organization && <p style={paragraphStyle}><strong style={strongStyle}>Организация:</strong> {section.organization}</p>}
             {section.date && <p style={{ ...paragraphStyle, margin: 0 }}><strong style={strongStyle}>Дата:</strong> {section.date}</p>}
           </div>
         </div>
       );
    case 'language':
       const proficiencyLevels = { /* ... levels ... */ };
       const proficiencyLabel = proficiencyLevels[section.proficiency] || section.proficiency;
       return (
         <div key={section.id || index} style={sectionStyle}>
            <h4 style={titleStyle}>{section.language || 'Язык'}</h4> {/* Use h4 */}
            <div style={contentWrapperStyle}>
              <p style={{ ...paragraphStyle, margin: 0 }}><strong style={strongStyle}>Уровень:</strong> {proficiencyLabel}</p>
            </div>
         </div>
       );
    case 'generic':
    default:
      return (
        <div key={section.id || index} style={sectionStyle}>
          <h4 style={titleStyle}>{section.title || 'Дополнительный раздел'}</h4> {/* Use h4 */}
          <div style={contentWrapperStyle}>{section.content}</div>
        </div>
      );
  }
};


// --- Classic Template (Revamped) ---
// Clean, two-column layout
const ClassicTemplate = ({ userData }) => (
  <Card mode="shadow" style={{ padding: '30px', fontFamily: 'Arial, serif', backgroundColor: '#ffffff', color: TEXT_COLOR, fontSize: '14px', lineHeight: '1.6' }}>
    {/* Header */}
    <div style={{ textAlign: 'center', marginBottom: 25, paddingBottom: 20, borderBottom: `1px solid ${BORDER_COLOR}` }}>
      <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', color: HEADING_COLOR_DARK, fontWeight: '600' }}>{userData.firstName} {userData.lastName}</h1>
      <h2 style={{ margin: 0, fontSize: '18px', color: SUBHEADING_COLOR, fontWeight: 'normal' }}>{userData.position}</h2>
    </div>

    <div style={{ display: 'flex', gap: '30px' }}>
      {/* Left Column (Contact, Skills) */}
      <div style={{ width: '30%' }}>
        {userData.photo && <Avatar size={100} src={userData.photo} style={{ marginBottom: 20, width: '100%', height: 'auto', borderRadius: '3px' }} />}

        {/* Contact Info */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: '16px', color: HEADING_COLOR_DARK, marginBottom: 10, borderBottom: `1px solid ${BORDER_COLOR}`, paddingBottom: 5 }}>Контакты</h3>
          {userData.email && <div style={{ marginBottom: 5 }}>{userData.email}</div>}
          {userData.phone && <div>{userData.phone}</div>}
        </div>

        {/* Skills */}
        <div>
          <h3 style={{ fontSize: '16px', color: HEADING_COLOR_DARK, marginBottom: 10, borderBottom: `1px solid ${BORDER_COLOR}`, paddingBottom: 5 }}>Навыки</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {userData.skills?.split(',').map((skill, index) => (
              <li key={index} style={{ marginBottom: 5 }}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Column (Experience, Education, Custom) */}
      <div style={{ width: '70%' }}>
        {/* Experience */}
        <div style={{ marginBottom: 25 }}>
          <h3 style={{ fontSize: '18px', color: HEADING_COLOR_DARK, marginBottom: 15, borderBottom: `2px solid ${HEADING_COLOR_DARK}`, paddingBottom: 5 }}>Опыт работы</h3>
          {userData.experience?.map((exp, index) => (
            <div key={index} style={{ marginBottom: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: HEADING_COLOR_DARK }}>{exp.position}</h4>
                <div style={{ color: SUBHEADING_COLOR, fontSize: '13px' }}>{exp.period}</div>
              </div>
              <div style={{ fontStyle: 'italic', color: SUBHEADING_COLOR, marginBottom: 5, fontSize: '14px' }}>{exp.company}</div>
              <div style={{ whiteSpace: 'pre-line' }}>{exp.description}</div>
            </div>
          ))}
        </div>

        {/* Education */}
        <div style={{ marginBottom: 25 }}>
          <h3 style={{ fontSize: '18px', color: HEADING_COLOR_DARK, marginBottom: 15, borderBottom: `2px solid ${HEADING_COLOR_DARK}`, paddingBottom: 5 }}>Образование</h3>
          {userData.education?.map((edu, index) => (
            <div key={index} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: HEADING_COLOR_DARK }}>{edu.institution}</h4>
                <div style={{ color: SUBHEADING_COLOR, fontSize: '13px' }}>{edu.year}</div>
              </div>
              <div>{edu.degree}</div>
            </div>
          ))}
        </div>

        {/* Render Custom Sections */}
        {userData.customSections?.map((section, index) => renderCustomSection(section, index, 'classic'))}
      </div>
    </div>
  </Card>
);

// --- Modern Template (Layout Fixed) ---
// Restored two-column layout, refined styles
const ModernTemplate = ({ userData }) => (
  <Card mode="shadow" style={{ padding: '30px', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', backgroundColor: '#f8f9fa', color: TEXT_COLOR, fontSize: '14px', lineHeight: '1.6' }}>
    {/* Header */}
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 30, paddingBottom: 20, borderBottom: `2px solid ${ACCENT_BLUE}` }}>
      {userData.photo && <Avatar size={100} src={userData.photo} style={{ marginRight: 25, borderRadius: '50%', border: `3px solid ${ACCENT_BLUE}` }} />}
      <div style={{ flexGrow: 1 }}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', color: HEADING_COLOR_DARK, fontWeight: 'bold' }}>{userData.firstName} {userData.lastName}</h1>
        <h2 style={{ margin: 0, fontSize: '20px', color: ACCENT_BLUE, fontWeight: 'normal' }}>{userData.position}</h2>
      </div>
    </div>

    <div style={{ display: 'flex', gap: '30px' }}>
      {/* Left Column (Contacts, Skills) */}
      <div style={{ width: '35%' }}>
        {/* Contacts */}
        <div style={{ marginBottom: 25 }}>
          <h3 style={{ fontSize: '16px', color: ACCENT_BLUE, marginBottom: 10, borderBottom: `1px solid ${BORDER_COLOR}`, paddingBottom: 5, fontWeight: '600' }}>Контакты</h3>
          {userData.email && <div style={{ marginBottom: 5, wordBreak: 'break-all' }}>{userData.email}</div>}
          {userData.phone && <div>{userData.phone}</div>}
        </div>

        {/* Skills */}
        <div style={{ marginBottom: 25 }}>
          <h3 style={{ fontSize: '16px', color: ACCENT_BLUE, marginBottom: 10, borderBottom: `1px solid ${BORDER_COLOR}`, paddingBottom: 5, fontWeight: '600' }}>Навыки</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {userData.skills?.split(',').map((skill, index) => (
              <span key={index} style={{ background: '#e9ecef', borderRadius: '4px', padding: '4px 8px', fontSize: '13px', color: '#343a40' }}>{skill}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (Experience, Education, Custom) */}
      <div style={{ width: '65%' }}>
        {/* Experience */}
        <div style={{ marginBottom: 25 }}>
          <h3 style={{ fontSize: '18px', color: HEADING_COLOR_DARK, marginBottom: 15, borderBottom: `2px solid ${BORDER_COLOR}`, paddingBottom: 5, fontWeight: 'bold' }}>Опыт работы</h3>
          {userData.experience?.map((exp, index) => (
            <div key={index} style={{ marginBottom: 15, paddingLeft: 15, borderLeft: `3px solid ${ACCENT_BLUE}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: HEADING_COLOR_DARK }}>{exp.position}</h4>
                <div style={{ color: SUBHEADING_COLOR, fontSize: '13px' }}>{exp.period}</div>
              </div>
              <div style={{ fontStyle: 'italic', color: SUBHEADING_COLOR, marginBottom: 5, fontSize: '14px' }}>{exp.company}</div>
              <div style={{ whiteSpace: 'pre-line' }}>{exp.description}</div>
            </div>
          ))}
        </div>

        {/* Education */}
        <div style={{ marginBottom: 25 }}>
          <h3 style={{ fontSize: '18px', color: HEADING_COLOR_DARK, marginBottom: 15, borderBottom: `2px solid ${BORDER_COLOR}`, paddingBottom: 5, fontWeight: 'bold' }}>Образование</h3>
          {userData.education?.map((edu, index) => (
            <div key={index} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: HEADING_COLOR_DARK }}>{edu.institution}</h4>
                <div style={{ color: SUBHEADING_COLOR, fontSize: '13px' }}>{edu.year}</div>
              </div>
              <div>{edu.degree}</div>
            </div>
          ))}
        </div>

         {/* Render Custom Sections */}
         {userData.customSections?.map((section, index) => renderCustomSection(section, index, 'modern'))}
      </div>
    </div>
  </Card>
);


// --- Creative Template (Revamped) ---
// Unique header, clear sections with accent color
const CreativeTemplate = ({ userData }) => (
  <Card mode="shadow" style={{ padding: 0, fontFamily: '"Lato", "Helvetica Neue", Helvetica, Arial, sans-serif', backgroundColor: '#ffffff', color: TEXT_COLOR, fontSize: '14px', lineHeight: '1.6', borderTop: `5px solid ${ACCENT_TEAL}` }}>
    {/* Header Section */}
    <div style={{ backgroundColor: '#f8f9fa', padding: '25px 30px', display: 'flex', alignItems: 'center', gap: '25px', borderBottom: `1px solid ${BORDER_COLOR}` }}>
      {userData.photo && <Avatar size={100} src={userData.photo} style={{ borderRadius: '50%', flexShrink: 0 }} />}
      <div style={{ flexGrow: 1 }}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', color: HEADING_COLOR_DARK, fontWeight: '700' }}>{userData.firstName} {userData.lastName}</h1>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '19px', color: ACCENT_TEAL, fontWeight: 'normal' }}>{userData.position}</h2>
        {/* Contact Icons (Optional - requires importing icons) */}
        <div style={{ display: 'flex', gap: '15px', color: SUBHEADING_COLOR, fontSize: '13px' }}>
           {userData.email && <span>{/* <Icon24MailOutline width={16} height={16} /> */} {userData.email}</span>}
           {userData.phone && <span>{/* <Icon24PhoneOutline width={16} height={16} /> */} {userData.phone}</span>}
        </div>
      </div>
    </div>

    {/* Main Content Padding */}
    <div style={{ padding: '25px 30px' }}>
      {/* Skills */}
      <div style={{ marginBottom: 25 }}>
        <h3 style={{ fontSize: '16px', color: ACCENT_TEAL, marginBottom: 15, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', borderBottom: `1px solid ${BORDER_COLOR}`, paddingBottom: 5 }}>Навыки</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {userData.skills?.split(',').map((skill, index) => (
            <span key={index} style={{ background: '#e4f6f8', color: '#0c5460', padding: '5px 12px', borderRadius: '15px', fontSize: '13px' }}>{skill}</span>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div style={{ marginBottom: 25 }}>
        <h3 style={{ fontSize: '16px', color: ACCENT_TEAL, marginBottom: 15, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', borderBottom: `1px solid ${BORDER_COLOR}`, paddingBottom: 5 }}>Опыт работы</h3>
        {userData.experience?.map((exp, index) => (
          <div key={index} style={{ marginBottom: 20, paddingLeft: 15, borderLeft: `3px solid ${ACCENT_TEAL}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: HEADING_COLOR_DARK }}>{exp.position}</h4>
              <div style={{ color: SUBHEADING_COLOR, fontSize: '13px' }}>{exp.period}</div>
            </div>
            <div style={{ fontStyle: 'italic', color: SUBHEADING_COLOR, marginBottom: 5, fontSize: '14px' }}>{exp.company}</div>
            <div style={{ whiteSpace: 'pre-line' }}>{exp.description}</div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div style={{ marginBottom: 25 }}>
        <h3 style={{ fontSize: '16px', color: ACCENT_TEAL, marginBottom: 15, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', borderBottom: `1px solid ${BORDER_COLOR}`, paddingBottom: 5 }}>Образование</h3>
        {userData.education?.map((edu, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: HEADING_COLOR_DARK }}>{edu.institution}</h4>
              <div style={{ color: SUBHEADING_COLOR, fontSize: '13px' }}>{edu.year}</div>
            </div>
            <div>{edu.degree}</div>
          </div>
        ))}
      </div>

      {/* Render Custom Sections */}
      {userData.customSections?.map((section, index) => renderCustomSection(section, index, 'creative'))}
    </div>
  </Card>
);


// --- Prop Types for Templates ---
const TemplatePropTypes = {
  userData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    photo: PropTypes.string,
    position: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string),
    experience: PropTypes.arrayOf(PropTypes.shape({
      company: PropTypes.string,
      position: PropTypes.string,
      period: PropTypes.string,
      description: PropTypes.string,
    })),
    education: PropTypes.arrayOf(PropTypes.shape({
      institution: PropTypes.string,
      degree: PropTypes.string,
      year: PropTypes.string,
    })),
    // Updated customSections prop type
    customSections: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Added ID
      type: PropTypes.string.isRequired, // Added type
      // Add all potential fields from different types as optional
      title: PropTypes.string,
      content: PropTypes.string,
      description: PropTypes.string, // From project
      link: PropTypes.string,       // From project
      technologies: PropTypes.string, // From project
      name: PropTypes.string,         // From certification
      organization: PropTypes.string, // From certification
      date: PropTypes.string,         // From certification
      language: PropTypes.string,     // From language
      proficiency: PropTypes.string,  // From language
    })),
  }).isRequired,
};

ClassicTemplate.propTypes = TemplatePropTypes;
ModernTemplate.propTypes = TemplatePropTypes;
CreativeTemplate.propTypes = TemplatePropTypes;


// --- Main ResumeTemplates Component ---
// This component selects the correct template based on the prop
export const ResumeTemplates = ({ userData, selectedTemplate }) => {
  switch (selectedTemplate) {
    case 'modern':
      return <ModernTemplate userData={userData} />;
    case 'creative':
      return <CreativeTemplate userData={userData} />;
    case 'classic':
    default:
      return <ClassicTemplate userData={userData} />;
  }
};

ResumeTemplates.propTypes = {
  userData: TemplatePropTypes.userData, // Reuse the detailed shape
  selectedTemplate: PropTypes.string.isRequired,
};