import React from 'react';
import { Card, Avatar } from '@vkontakte/vkui';
import PropTypes from 'prop-types';

// Classic template
const ClassicTemplate = ({ userData }) => (
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
);

// Modern template
const ModernTemplate = ({ userData }) => (
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
);

// Creative template
const CreativeTemplate = ({ userData }) => (
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
);

export const ResumeTemplates = ({ templateType, userData }) => {
  const templates = {
    classic: <ClassicTemplate userData={userData} />,
    modern: <ModernTemplate userData={userData} />,
    creative: <CreativeTemplate userData={userData} />
  };

  return templates[templateType] || templates.classic;
};

ResumeTemplates.propTypes = {
  templateType: PropTypes.oneOf(['classic', 'modern', 'creative']).isRequired,
  userData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    photo: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    position: PropTypes.string,
    education: PropTypes.array,
    experience: PropTypes.array,
    skills: PropTypes.array
  }).isRequired
};